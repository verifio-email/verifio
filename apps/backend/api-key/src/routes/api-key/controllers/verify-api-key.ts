import { hashApiKey } from "@verifio/api-key/lib/api-key-hash";
import { redis } from "@verifio/api-key/lib/redis";
import { formatApiKeyResponse } from "@verifio/api-key/routes/api-key/controllers/format-api-key-response";
import type { ApiKeyTypes } from "@verifio/api-key/types/api-key.type";
import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { logger } from "@verifio/logger";
import { and, eq } from "drizzle-orm";

// Cache TTL: 1 hour (in seconds)
const CACHE_TTL_SECONDS = 3600;

// Cached API key data interface (subset for caching)
interface CachedApiKeyData {
	id: string;
	organizationId: string;
	userId: string;
	enabled: boolean;
	expiresAt: string | null;
	rateLimitEnabled: boolean;
	rateLimitMax: number;
	rateLimitTimeWindow: number;
	requestCount: number;
	name: string | null;
	start: string | null;
	prefix: string | null;
	remaining: number | null;
	lastRequest: string | null;
	createdAt: string;
	updatedAt: string;
	permissions: string | null;
	metadata: string | null;
	refillInterval: number | null;
	refillAmount: number | null;
	lastRefillAt: string | null;
	createdBy: {
		id: string;
		name: string | null;
		image: string | null;
		email: string;
	};
}

export async function verifyApiKey(
	apiKey: string,
): Promise<ApiKeyTypes.ApiKeyData | null> {
	logger.info(
		{ apiKey: `${apiKey.substring(0, 12)}...` },
		"Verifying API key",
	);

	try {
		// Hash the incoming API key to use as cache key and DB lookup
		const hashedKey = hashApiKey(apiKey);
		const cacheKey = `verified:${hashedKey}`;

		// Step 1: Check Redis cache first
		const cached = await redis.get<CachedApiKeyData>(cacheKey);
		if (cached) {
			logger.info({ id: cached.id }, "API key found in cache");

			// Check if expired
			if (cached.expiresAt && new Date(cached.expiresAt) < new Date()) {
				logger.warn({ id: cached.id }, "Cached API key has expired");
				await redis.delete(cacheKey);
				return null;
			}

			// Check if still enabled
			if (!cached.enabled) {
				logger.warn({ id: cached.id }, "Cached API key is disabled");
				await redis.delete(cacheKey);
				return null;
			}

			// Update request stats asynchronously (fire-and-forget)
			const now = new Date();
			db.update(schema.apikey)
				.set({
					lastRequest: now,
					requestCount: (cached.requestCount || 0) + 1,
					updatedAt: now,
				})
				.where(eq(schema.apikey.id, cached.id))
				.catch((err) => logger.error({ error: err }, "Failed to update request stats"));

			// Return cached data with updated key field
			return {
				...cached,
				key: hashedKey,
				expiresAt: cached.expiresAt ? new Date(cached.expiresAt) : null,
				lastRequest: cached.lastRequest ? new Date(cached.lastRequest) : null,
				createdAt: new Date(cached.createdAt),
				updatedAt: new Date(cached.updatedAt),
				lastRefillAt: cached.lastRefillAt ? new Date(cached.lastRefillAt) : null,
				encryptedKey: null,
			};
		}

		// Step 2: Cache miss - query database
		logger.info({ apiKey: `${apiKey.substring(0, 12)}...` }, "Cache miss, querying database");

		const result = await db.query.apikey.findFirst({
			where: and(
				eq(schema.apikey.key, hashedKey),
				eq(schema.apikey.enabled, true),
			),
			with: {
				user: true,
			},
		});

		if (!result) {
			logger.warn(
				{ apiKey: `${apiKey.substring(0, 12)}...` },
				"API key not found",
			);
			return null;
		}

		if (result.expiresAt && new Date(result.expiresAt) < new Date()) {
			logger.warn({ id: result.id }, "API key has expired");
			return null;
		}

		// Step 3: Cache the result for future lookups
		const cacheData: CachedApiKeyData = {
			id: result.id,
			organizationId: result.organizationId,
			userId: result.userId,
			enabled: result.enabled,
			expiresAt: result.expiresAt?.toISOString() ?? null,
			rateLimitEnabled: result.rateLimitEnabled,
			rateLimitMax: result.rateLimitMax,
			rateLimitTimeWindow: result.rateLimitTimeWindow,
			requestCount: result.requestCount,
			name: result.name,
			start: result.start,
			prefix: result.prefix,
			remaining: result.remaining,
			lastRequest: result.lastRequest?.toISOString() ?? null,
			createdAt: result.createdAt.toISOString(),
			updatedAt: result.updatedAt.toISOString(),
			permissions: result.permissions,
			metadata: result.metadata,
			refillInterval: result.refillInterval,
			refillAmount: result.refillAmount,
			lastRefillAt: result.lastRefillAt?.toISOString() ?? null,
			createdBy: {
				id: result.user.id,
				name: result.user.name,
				image: result.user.image,
				email: result.user.email,
			},
		};

		await redis.set(cacheKey, cacheData, CACHE_TTL_SECONDS);
		logger.info({ id: result.id }, "API key cached successfully");

		// Step 4: Update request stats
		const now = new Date();
		await db
			.update(schema.apikey)
			.set({
				lastRequest: now,
				requestCount: (result.requestCount || 0) + 1,
				updatedAt: now,
			})
			.where(eq(schema.apikey.id, result.id));

		logger.info({ id: result.id }, "API key verified successfully");
		return {
			...result,
			createdBy: {
				id: result.user.id,
				name: result.user.name,
				image: result.user.image,
				email: result.user.email,
			},
		};
	} catch (error) {
		logger.error(
			{
				error: error instanceof Error ? error.message : String(error),
			},
			"Error verifying API key",
		);
		return null;
	}
}

export async function validateApiKeyHandler(
	apiKey: string,
): Promise<{ valid: boolean; apiKey?: ApiKeyTypes.ApiKeyResponse }> {
	logger.info(
		{ apiKey: `${apiKey.substring(0, 12)}...` },
		"Validating API key",
	);

	try {
		const validated = await verifyApiKey(apiKey);
		if (!validated) {
			return { valid: false };
		}

		return {
			valid: true,
			apiKey: formatApiKeyResponse(validated),
		};
	} catch (error) {
		logger.error(
			{
				error: error instanceof Error ? error.message : String(error),
			},
			"Error verifying API key",
		);
		return { valid: false };
	}
}

// Alias for backward compatibility
export const validateApiKey = verifyApiKey;
