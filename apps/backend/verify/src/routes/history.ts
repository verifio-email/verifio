/**
 * Verification History Route
 * GET /v1/history - Get verification history for the organization
 */

import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { logger } from "@verifio/logger";
import { and, count, desc, eq, isNull } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { authMiddleware } from "../middleware/auth";

const PaginationQuery = t.Object({
	page: t.Optional(t.String({ default: "1" })),
	limit: t.Optional(t.String({ default: "20" })),
});

export const historyRoute = new Elysia({
	prefix: "/v1",
	name: "HistoryRoutes",
})
	.use(authMiddleware)
	.get(
		"/history",
		async ({ query, organizationId, userId }) => {
			if (!organizationId) {
				return {
					success: false,
					error: "Organization context required",
				};
			}

			const page = Math.max(1, Number.parseInt(query.page || "1"));
			const limit = Math.min(
				100,
				Math.max(1, Number.parseInt(query.limit || "20")),
			);
			const offset = (page - 1) * limit;

			try {
				logger.info(
					{ organizationId, page, limit },
					"Fetching verification history",
				);

				// Get total count (only single verifications - where jobId is null)
				const countResult = await db
					.select({ total: count() })
					.from(schema.verificationResult)
					.where(
						and(
							eq(schema.verificationResult.organizationId, organizationId),
							isNull(schema.verificationResult.jobId),
						),
					);
				const total = countResult[0]?.total ?? 0;

				// Get results (only single verifications - where jobId is null)
				const results = await db
					.select({
						id: schema.verificationResult.id,
						email: schema.verificationResult.email,
						state: schema.verificationResult.state,
						score: schema.verificationResult.score,
						reason: schema.verificationResult.reason,
						result: schema.verificationResult.result,
						createdAt: schema.verificationResult.createdAt,
					})
					.from(schema.verificationResult)
					.where(
						and(
							eq(schema.verificationResult.organizationId, organizationId),
							isNull(schema.verificationResult.jobId),
						),
					)
					.orderBy(desc(schema.verificationResult.createdAt))
					.limit(limit)
					.offset(offset);

				return {
					success: true,
					data: {
						results,
						pagination: {
							page,
							limit,
							total,
							totalPages: Math.ceil(total / limit),
						},
					},
				};
			} catch (error) {
				logger.error({ error, organizationId }, "Failed to fetch history");
				return {
					success: false,
					error: "Failed to fetch verification history",
				};
			}
		},
		{
			auth: true,
			query: PaginationQuery,
			detail: {
				summary: "Get verification history",
				description: "Get paginated verification history for the organization",
				tags: ["History"],
			},
		},
	)
	.get(
		"/jobs",
		async ({ query, organizationId }) => {
			if (!organizationId) {
				return {
					success: false,
					error: "Organization context required",
				};
			}

			const page = Math.max(1, Number.parseInt(query.page || "1"));
			const limit = Math.min(
				50,
				Math.max(1, Number.parseInt(query.limit || "10")),
			);
			const offset = (page - 1) * limit;

			try {
				logger.info(
					{ organizationId, page, limit },
					"Fetching verification jobs",
				);

				// Get total count
				const countResult = await db
					.select({ total: count() })
					.from(schema.verificationJob)
					.where(eq(schema.verificationJob.organizationId, organizationId));
				const total = countResult[0]?.total ?? 0;

				// Get jobs
				const jobs = await db
					.select({
						id: schema.verificationJob.id,
						name: schema.verificationJob.name,
						status: schema.verificationJob.status,
						totalEmails: schema.verificationJob.totalEmails,
						processedEmails: schema.verificationJob.processedEmails,
						stats: schema.verificationJob.stats,
						createdAt: schema.verificationJob.createdAt,
						completedAt: schema.verificationJob.completedAt,
					})
					.from(schema.verificationJob)
					.where(eq(schema.verificationJob.organizationId, organizationId))
					.orderBy(desc(schema.verificationJob.createdAt))
					.limit(limit)
					.offset(offset);

				return {
					success: true,
					data: {
						jobs,
						pagination: {
							page,
							limit,
							total,
							totalPages: Math.ceil(total / limit),
						},
					},
				};
			} catch (error) {
				logger.error({ error, organizationId }, "Failed to fetch jobs");
				return {
					success: false,
					error: "Failed to fetch verification jobs",
				};
			}
		},
		{
			auth: true,
			query: PaginationQuery,
			detail: {
				summary: "Get verification jobs",
				description:
					"Get paginated bulk verification jobs for the organization",
				tags: ["History"],
			},
		},
	)
	.get(
		"/results/:resultId",
		async ({ params, organizationId }) => {
			if (!organizationId) {
				return {
					success: false,
					error: "Organization context required",
				};
			}

			try {
				logger.info(
					{ organizationId, resultId: params.resultId },
					"Fetching verification result",
				);

				const [result] = await db
					.select()
					.from(schema.verificationResult)
					.where(eq(schema.verificationResult.id, params.resultId))
					.limit(1);

				if (!result) {
					return {
						success: false,
						error: "Verification result not found",
					};
				}

				// Ensure result belongs to this organization
				if (result.organizationId !== organizationId) {
					return {
						success: false,
						error: "Verification result not found",
					};
				}

				return {
					success: true,
					data: result,
				};
			} catch (error) {
				logger.error(
					{ error, resultId: params.resultId },
					"Failed to fetch verification result",
				);
				return {
					success: false,
					error: "Failed to fetch verification result",
				};
			}
		},
		{
			auth: true,
			params: t.Object({ resultId: t.String() }),
			detail: {
				summary: "Get verification result",
				description: "Get a single verification result by ID",
				tags: ["History"],
			},
		},
	);
