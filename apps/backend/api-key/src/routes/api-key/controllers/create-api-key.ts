import { randomBytes } from "node:crypto";
import { createId } from "@paralleldrive/cuid2";
import { formatApiKeyWithKeyResponse } from "@verifio/api-key/routes/api-key/controllers/format-api-key-response";
import type { ApiKeyTypes } from "@verifio/api-key/types/api-key.type";
import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { logger } from "@verifio/logger";
import { logActivity } from "@verifio/logging";
import { eq } from "drizzle-orm";
import { status } from "elysia";

const API_KEY_PREFIX = "rl";
const API_KEY_LENGTH = 64;

function generateApiKey(): string {
	const randomPart = randomBytes(API_KEY_LENGTH).toString("base64url");
	return `${API_KEY_PREFIX}_${randomPart}`;
}

function getKeyStart(key: string): string {
	const parts = key.split("_");
	if (parts.length >= 2) {
		return `${parts[0]}_${parts[1]?.substring(0, 8) ?? ""}`;
	}
	return key.substring(0, 12);
}
export async function createApiKey(
	organizationId: string,
	userId: string,
	request: ApiKeyTypes.CreateApiKeyRequest,
): Promise<ApiKeyTypes.ApiKeyWithKeyResponse> {
	try {
		// Generate API key
		const fullKey = generateApiKey();
		const keyStart = getKeyStart(fullKey);
		const keyId = createId();

		logger.info("Creating API key", organizationId, userId, keyStart, keyId);
		const now = new Date();
		const expiresAt = request.expiresAt ? new Date(request.expiresAt) : null;

		// Set defaults
		const enabled = request.enabled ?? true;
		const rateLimitEnabled = request.rateLimitEnabled ?? true;
		const rateLimitTimeWindow = request.rateLimitTimeWindow ?? 86400000; // 24 hours
		const rateLimitMax = request.rateLimitMax ?? 10;
		const remaining = request.refillAmount ?? rateLimitMax;

		const newApiKey = await db
			.insert(schema.apikey)
			.values({
				id: keyId,
				name: request.name || null,
				start: keyStart,
				prefix: API_KEY_PREFIX,
				key: fullKey,
				organizationId,
				userId,
				refillInterval: request.refillInterval ?? null,
				refillAmount: request.refillAmount ?? null,
				lastRefillAt: null,
				enabled,
				rateLimitEnabled,
				rateLimitTimeWindow,
				rateLimitMax,
				requestCount: 0,
				remaining,
				lastRequest: null,
				expiresAt,
				createdAt: now,
				updatedAt: now,
				permissions: request.permissions ?? null,
				metadata: request.metadata ?? null,
			})
			.returning();

		if (!newApiKey[0]) {
			logger.error({ organizationId, userId }, "Failed to create API key");
			throw status(500, { message: "Failed to create API key" });
		}

		// Fetch the user info to include in the response
		const user = await db.query.user.findFirst({
			where: eq(schema.user.id, userId),
		});

		if (!user) {
			logger.error(
				{ organizationId, userId },
				"User not found for API key creation",
			);
			throw status(500, { message: "User not found" });
		}

		logger.info("newApiKey", newApiKey);

		return formatApiKeyWithKeyResponse(
			{
				...newApiKey[0],
				createdBy: {
					id: user.id,
					name: user.name,
					image: user.image,
					email: user.email,
				},
			},
			fullKey,
		);
	} catch (error) {
		logger.error(
			{
				organizationId,
				userId,
				error: error instanceof Error ? error.message : String(error),
			},
			"Error creating API key",
		);
		throw error;
	}
}

export async function createApiKeyHandler(
	organizationId: string,
	userId: string,
	body: ApiKeyTypes.CreateApiKeyRequest,
): Promise<ApiKeyTypes.ApiKeyWithKeyResponse> {
	const startTime = Date.now();
	try {
		const apiKey = await createApiKey(organizationId, userId, body);

		// Log successful API key creation
		logActivity({
			service: "api-key",
			endpoint: "/v1/",
			method: "POST",
			organization_id: organizationId,
			user_id: userId,
			resource_type: "api-key",
			resource_id: apiKey.id,
			status: "success",
			result: "created",
			duration_ms: Date.now() - startTime,
		}).catch(() => { });

		return apiKey;
	} catch (error) {
		logger.error(
			{
				organizationId,
				userId,
				error: error instanceof Error ? error.message : String(error),
			},
			"Error creating API key",
		);

		// Log failed API key creation
		logActivity({
			service: "api-key",
			endpoint: "/v1/",
			method: "POST",
			organization_id: organizationId,
			user_id: userId,
			resource_type: "api-key",
			status: "error",
			error_message: error instanceof Error ? error.message : String(error),
			duration_ms: Date.now() - startTime,
		}).catch(() => { });

		throw error;
	}
}
