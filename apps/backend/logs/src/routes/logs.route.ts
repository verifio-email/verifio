import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { logger } from "@verifio/logger";
import { and, desc, eq, gte, ilike, lte, sql } from "drizzle-orm";
import { Elysia } from "elysia";
import { LoggingModel } from "./logging.model";

export const logsRoute = new Elysia().get(
	"/logs",
	async ({ query }) => {
		try {
			const page = query.page || 1;
			const limit = query.limit || 20;
			const offset = (page - 1) * limit;

			const conditions = [
				eq(schema.activityLogs.organizationId, query.organization_id),
			];

			if (query.api_key_id) {
				conditions.push(eq(schema.activityLogs.apiKeyId, query.api_key_id));
			}
			if (query.service) {
				conditions.push(eq(schema.activityLogs.service, query.service));
			}
			if (query.endpoint) {
				conditions.push(eq(schema.activityLogs.endpoint, query.endpoint));
			}
			if (query.status) {
				conditions.push(eq(schema.activityLogs.status, query.status));
			}
			if (query.from) {
				conditions.push(
					gte(schema.activityLogs.createdAt, new Date(query.from)),
				);
			}
			if (query.to) {
				conditions.push(lte(schema.activityLogs.createdAt, new Date(query.to)));
			}
			if (query.search) {
				conditions.push(
					ilike(schema.activityLogs.resourceId, `%${query.search}%`),
				);
			}

			const whereClause = and(...conditions);

			const [countResult] = await db
				.select({ count: sql<number>`count(*)::int` })
				.from(schema.activityLogs)
				.where(whereClause);

			const total = countResult?.count || 0;

			const results = await db
				.select()
				.from(schema.activityLogs)
				.where(whereClause)
				.orderBy(desc(schema.activityLogs.createdAt))
				.limit(limit)
				.offset(offset);

			logger.debug(
				{ organizationId: query.organization_id, page, limit, total },
				"Activity logs queried",
			);

			return {
				success: true,
				data: results.map((row) => ({
					id: row.id,
					user_id: row.userId,
					organization_id: row.organizationId,
					api_key_id: row.apiKeyId,
					service: row.service,
					endpoint: row.endpoint,
					method: row.method,
					resource_type: row.resourceType,
					resource_id: row.resourceId,
					status: row.status,
					result: row.result,
					error_message: row.errorMessage,
					credits_used: row.creditsUsed,
					duration_ms: row.durationMs,
					ip_address: row.ipAddress,
					user_agent: row.userAgent,
					metadata: row.metadata,
					created_at: row.createdAt.toISOString(),
				})),
				pagination: {
					page,
					limit,
					total,
					total_pages: Math.ceil(total / limit),
				},
			};
		} catch (error) {
			logger.error(
				{ error: error instanceof Error ? error.message : "Unknown error" },
				"Failed to query activity logs",
			);

			throw error;
		}
	},
	{
		query: LoggingModel.logsQuery,
		response: {
			200: LoggingModel.logsResponse,
		},
		detail: {
			tags: ["Logging"],
			summary: "Query activity logs",
			description: "Get activity logs with filtering and pagination",
		},
	},
);
