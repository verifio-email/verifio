import { formatApiKeyResponse } from "@verifio/api-key/routes/api-key/controllers/format-api-key-response";
import type { ApiKeyTypes } from "@verifio/api-key/types/api-key.type";
import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { logger } from "@verifio/logger";
import { and, eq } from "drizzle-orm";

export async function validateApiKey(
	apiKey: string,
): Promise<ApiKeyTypes.ApiKeyData | null> {
	logger.info(
		{ apiKey: apiKey.substring(0, 12) + "..." },
		"Validating API key",
	);

	try {
		// Find API key by direct comparison (stored as full key)
		const result = await db.query.apikey.findFirst({
			where: and(
				eq(schema.apikey.key, apiKey),
				eq(schema.apikey.enabled, true),
			),
			with: {
				user: true,
			},
		});

		if (!result) {
			logger.warn(
				{ apiKey: apiKey.substring(0, 12) + "..." },
				"API key not found",
			);
			return null;
		}

		// Check expiration
		if (result.expiresAt && new Date(result.expiresAt) < new Date()) {
			logger.warn({ id: result.id }, "API key has expired");
			return null;
		}

		// Update last request
		const now = new Date();
		await db
			.update(schema.apikey)
			.set({
				lastRequest: now,
				requestCount: (result.requestCount || 0) + 1,
				updatedAt: now,
			})
			.where(eq(schema.apikey.id, result.id));

		logger.info({ id: result.id }, "API key validated successfully");
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
			"Error validating API key",
		);
		return null;
	}
}

export async function validateApiKeyHandler(
	apiKey: string,
): Promise<{ valid: boolean; apiKey?: ApiKeyTypes.ApiKeyResponse }> {
	logger.info(
		{ apiKey: apiKey.substring(0, 12) + "..." },
		"Validating API key",
	);

	try {
		const validated = await validateApiKey(apiKey);
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
			"Error validating API key",
		);
		return { valid: false };
	}
}
