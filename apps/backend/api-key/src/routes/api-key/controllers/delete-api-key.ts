import { redis } from "@verifio/api-key/lib/redis";
import type { OrgRole } from "@verifio/api-key/middleware/auth";
import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { logActivity, logger } from "@verifio/logger";
import { and, eq, isNull } from "drizzle-orm";
import { status } from "elysia";

export async function deleteApiKey(
	apiKeyId: string,
	organizationId: string,
	userId: string,
	role: OrgRole,
): Promise<void> {
	logger.info(
		{ apiKeyId, organizationId, userId, role },
		"Attempting to delete API key",
	);

	try {
		// 1. Fetch the API key first, independent of the current organization context
		const existingApiKey = await db.query.apikey.findFirst({
			where: and(
				eq(schema.apikey.id, apiKeyId),
				isNull(schema.apikey.deletedAt),
			),
		});

		if (!existingApiKey) {
			logger.warn({ apiKeyId }, "API key not found or already deleted");
			throw status(404, { message: "API key not found" });
		}

		// 2. Determine authorization
		let isAuthorized = false;

		// Check if user is the creator
		if (existingApiKey.userId === userId) {
			isAuthorized = true;
		} else {
			// Check organization role
			if (existingApiKey.organizationId === organizationId) {
				// Key belongs to active organization, use passed role
				isAuthorized = role === "owner" || role === "admin";
			} else {
				// Key belongs to another organization, verify user's role in THAT organization
				const membership = await db.query.member.findFirst({
					where: and(
						eq(schema.member.organizationId, existingApiKey.organizationId),
						eq(schema.member.userId, userId),
					),
				});

				if (membership) {
					isAuthorized =
						membership.role === "owner" || membership.role === "admin";
				}
			}
		}

		if (!isAuthorized) {
			logger.warn(
				{ apiKeyId, userId, organizationId },
				"Unauthorized to delete API key",
			);
			throw status(403, { message: "Unauthorized to delete API key" });
		}

		// 3. Perform Soft Delete
		await db
			.update(schema.apikey)
			.set({ deletedAt: new Date() })
			.where(eq(schema.apikey.id, apiKeyId));

		logger.info({ apiKeyId }, "API key soft deleted successfully");

		// Invalidate cache for this API key
		const cacheKey = `verified:${existingApiKey.key}`;
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
