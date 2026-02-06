import { decryptApiKey } from "@verifio/api-key/lib/encryption";
import type { ApiKeyTypes } from "@verifio/api-key/types/api-key.type";

export function formatApiKeyResponse(
	apiKey: ApiKeyTypes.ApiKeyData,
): ApiKeyTypes.ApiKeyResponse {
	// Decrypt the full key if available, otherwise fall back to the display prefix
	const fullKey = apiKey.encryptedKey
		? decryptApiKey(apiKey.encryptedKey)
		: (apiKey.start ?? "");

	return {
		id: apiKey.id,
		name: apiKey.name,
		key: fullKey,
		start: apiKey.start,
		prefix: apiKey.prefix,
		organizationId: apiKey.organizationId,
		userId: apiKey.userId,
		refillInterval: apiKey.refillInterval,
		refillAmount: apiKey.refillAmount,
		lastRefillAt: apiKey.lastRefillAt?.toISOString() ?? null,
		enabled: apiKey.enabled,
		rateLimitEnabled: apiKey.rateLimitEnabled,
		rateLimitTimeWindow: apiKey.rateLimitTimeWindow,
		rateLimitMax: apiKey.rateLimitMax,
		requestCount: apiKey.requestCount,
		remaining: apiKey.remaining,
		lastRequest: apiKey.lastRequest?.toISOString() ?? null,
		expiresAt: apiKey.expiresAt?.toISOString() ?? null,
		createdAt: apiKey.createdAt.toISOString(),
		updatedAt: apiKey.updatedAt.toISOString(),
		permissions: apiKey.permissions,
		metadata: apiKey.metadata,
		createdBy: apiKey.createdBy,
	};
}

export function formatApiKeyWithKeyResponse(
	apiKey: ApiKeyTypes.ApiKeyData,
	fullKey: string,
): ApiKeyTypes.ApiKeyWithKeyResponse {
	return {
		id: apiKey.id,
		name: apiKey.name,
		key: fullKey,
		start: apiKey.start,
		prefix: apiKey.prefix,
		organizationId: apiKey.organizationId,
		userId: apiKey.userId,
		refillInterval: apiKey.refillInterval,
		refillAmount: apiKey.refillAmount,
		lastRefillAt: apiKey.lastRefillAt?.toISOString() ?? null,
		enabled: apiKey.enabled,
		rateLimitEnabled: apiKey.rateLimitEnabled,
		rateLimitTimeWindow: apiKey.rateLimitTimeWindow,
		rateLimitMax: apiKey.rateLimitMax,
		requestCount: apiKey.requestCount,
		remaining: apiKey.remaining,
		lastRequest: apiKey.lastRequest?.toISOString() ?? null,
		expiresAt: apiKey.expiresAt?.toISOString() ?? null,
		createdAt: apiKey.createdAt.toISOString(),
		updatedAt: apiKey.updatedAt.toISOString(),
		permissions: apiKey.permissions,
		metadata: apiKey.metadata,
	};
}
