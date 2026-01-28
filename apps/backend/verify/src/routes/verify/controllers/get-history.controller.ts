import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { logger } from "@verifio/logger";
import { and, count, desc, eq, isNull } from "drizzle-orm";

export async function getVerificationHistoryHandler(
	organizationId: string,
	page: number,
	limit: number,
) {
	try {
		logger.info(
			{ organizationId, page, limit },
			"Fetching verification history",
		);

		const offset = (page - 1) * limit;

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

		// Get results
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
			success: true as const,
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
			success: false as const,
			error: "Failed to fetch verification history",
		};
	}
}

export async function getVerificationJobsHandler(
	organizationId: string,
	page: number,
	limit: number,
) {
	try {
		logger.info({ organizationId, page, limit }, "Fetching verification jobs");

		const offset = (page - 1) * limit;

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
			success: true as const,
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
			success: false as const,
			error: "Failed to fetch verification jobs",
		};
	}
}

export async function getVerificationResultHandler(
	resultId: string,
	organizationId: string,
) {
	try {
		logger.info({ organizationId, resultId }, "Fetching verification result");

		const [result] = await db
			.select()
			.from(schema.verificationResult)
			.where(eq(schema.verificationResult.id, resultId))
			.limit(1);

		if (!result) {
			return {
				success: false as const,
				error: "Verification result not found",
			};
		}

		// Ensure result belongs to this organization
		if (result.organizationId !== organizationId) {
			return {
				success: false as const,
				error: "Verification result not found",
			};
		}

		return {
			success: true as const,
			data: result,
		};
	} catch (error) {
		logger.error({ error, resultId }, "Failed to fetch verification result");
		return {
			success: false as const,
			error: "Failed to fetch verification result",
		};
	}
}
