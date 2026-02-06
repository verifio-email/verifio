import { redis } from "@verifio/api-key/lib/redis";
import type { OrgRole } from "@verifio/api-key/middleware/auth";
import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { logActivity, logger } from "@verifio/logger";
import { and, eq } from "drizzle-orm";
import { status } from "elysia";

export async function deleteApiKey(
	apiKeyId: string,
	organizationId: string,
	userId: string,
	role: OrgRole,
): Promise<void> {
	const isAdminOrOwner = role === "owner" || role === "admin";
	logger.info(
		{ apiKeyId, organizationId, userId, role, isAdminOrOwner },
		"Deleting API key",
	);

	try {
		// Admins/owners can delete any key in their org, others can only delete their own
		const whereConditions = isAdminOrOwner
			? [
				eq(schema.apikey.id, apiKeyId),
				eq(schema.apikey.organizationId, organizationId),
			]
			: [
				eq(schema.apikey.id, apiKeyId),
				eq(schema.apikey.organizationId, organizationId),
				eq(schema.apikey.userId, userId),
			];

		const existing = await db.query.apikey.findFirst({
			where: and(...whereConditions),
		});

		if (!existing) {
			logger.warn({ apiKeyId }, "API key not found");
			throw status(404, { message: "API key not found" });
		}

		await db.delete(schema.apikey).where(and(...whereConditions));

		logger.info({ apiKeyId }, "API key deleted successfully");

		// Invalidate cache for this API key
		const cacheKey = `verified:${existing.key}`;
		await redis.delete(cacheKey);
		logger.info({ apiKeyId }, "Cache invalidated for deleted API key");
	} catch (error) {
		logger.error(
			{
				apiKeyId,
				error: error instanceof Error ? error.message : String(error),
			},
			"Error deleting API key",
		);
		throw error;
	}
}

export async function deleteApiKeyHandler(
	apiKeyId: string,
	organizationId: string,
	userId: string,
	role: OrgRole,
): Promise<{ message: string }> {
	const startTime = Date.now();
	logger.info({ apiKeyId, organizationId, userId, role }, "Deleting API key");

	try {
		await deleteApiKey(apiKeyId, organizationId, userId, role);
		logger.info(
			{ apiKeyId, organizationId, userId },
			"API key deleted successfully",
		);

		logActivity({
			service: "api-key",
			endpoint: `/v1/${apiKeyId}`,
			method: "DELETE",
			organization_id: organizationId,
			user_id: userId,
			resource_type: "api-key",
			resource_id: apiKeyId,
			status: "success",
			result: "deleted",
			duration_ms: Date.now() - startTime,
		}).catch(() => { });

		return { message: "API key deleted successfully" };
	} catch (error) {
		logger.error(
			{
				apiKeyId,
				organizationId,
				userId,
				error: error instanceof Error ? error.message : String(error),
			},
			"Error deleting API key",
		);

		logActivity({
			service: "api-key",
			endpoint: `/v1/${apiKeyId}`,
			method: "DELETE",
			organization_id: organizationId,
			user_id: userId,
			resource_type: "api-key",
			resource_id: apiKeyId,
			status: "error",
			error_message: error instanceof Error ? error.message : String(error),
			duration_ms: Date.now() - startTime,
		}).catch(() => { });

		throw error;
	}
}
