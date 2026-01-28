import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { logger } from "@verifio/logger";
import { Elysia } from "elysia";
import { LoggingModel } from "./logging.model";

export const logRoute = new Elysia().post(
	"/log",
	async ({ body }) => {
		try {
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
		} catch (error) {
			logger.error(
				{ error: error instanceof Error ? error.message : "Unknown error" },
				"Failed to insert activity log",
			);

			throw error;
		}
	},
	{
		body: LoggingModel.logBody,
		response: {
			200: LoggingModel.logResponse,
		},
		detail: {
			tags: ["Logging"],
			summary: "Insert activity log",
			description: "Insert a single activity log entry",
		},
	},
);
