import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { logger } from "@verifio/logger";
import type { LogsTypes } from "@verifio/logs/types/logs.type";
import { status } from "elysia";

export async function createLog(
	body: LogsTypes.CreateLogRequest,
): Promise<LogsTypes.LogResponse> {
	const result = await db
		.insert(schema.activityLogs)
		.values({
			userId: body.user_id || null,
			organizationId: body.organization_id,
			apiKeyId: body.api_key_id || null,
			service: body.service,
			endpoint: body.endpoint,
			method: body.method,
			resourceType: body.resource_type || null,
			resourceId: body.resource_id || null,
			status: body.status,
			result: body.result || null,
			errorMessage: body.error_message || null,
			creditsUsed: body.credits_used || 0,
			durationMs: body.duration_ms || null,
			ipAddress: body.ip_address || null,
			userAgent: body.user_agent || null,
			metadata: body.metadata || {},
		})
		.returning({ id: schema.activityLogs.id });

	const inserted = result[0];
	if (!inserted) {
		throw new Error("Failed to insert activity log");
	}

	logger.debug(
		{ id: inserted.id, service: body.service, endpoint: body.endpoint },
		"Activity log inserted",
	);

	return {
		success: true,
		id: inserted.id,
	};
}

export async function createLogHandler(
	body: LogsTypes.CreateLogRequest,
): Promise<LogsTypes.LogResponse> {
	try {
		return await createLog(body);
	} catch (error) {
		logger.error(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			"Failed to insert activity log",
		);

		throw status(500, {
			success: false,
			message: error instanceof Error ? error.message : "Failed to create log",
		});
	}
}
