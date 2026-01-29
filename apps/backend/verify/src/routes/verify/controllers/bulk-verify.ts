import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import type { VerificationResult } from "@verifio/email-verify";
import { ActivityLogger, logger } from "@verifio/logger";
import {
	checkCredits,
	deductCredits,
} from "@verifio/verify/services/credits-client";
import type { VerifyTypes } from "@verifio/verify/types/verify.type";
import { verifyConfig } from "@verifio/verify/verify.config";
import { eq } from "drizzle-orm";

// Create activity logger instance
const activityLogger = new ActivityLogger({ url: verifyConfig.logsUrl });

interface BulkVerificationStatsJson {
	total: number;
	processed: number;
	deliverable: number;
	undeliverable: number;
	risky: number;
	unknown: number;
	breakdown: {
		disposable: number;
		roleBased: number;
		freeProvider: number;
		catchAll: number;
		syntaxErrors: number;
		dnsErrors: number;
		typosDetected: number;
	};
	averageScore: number;
	scoreDistribution: {
		excellent: number;
		good: number;
		fair: number;
		poor: number;
	};
	startedAt: string;
	completedAt: string;
	totalDuration: number;
	averageDuration: number;
}

/**
 * Calculate stats from results
 */
function calculateStats(
	results: VerificationResult[],
	startTime: number,
): BulkVerificationStatsJson {
	const now = new Date().toISOString();
	const totalDuration = Date.now() - startTime;

	const stats: BulkVerificationStatsJson = {
		total: results.length,
		processed: results.length,
		deliverable: 0,
		undeliverable: 0,
		risky: 0,
		unknown: 0,
		breakdown: {
			disposable: 0,
			roleBased: 0,
			freeProvider: 0,
			catchAll: 0,
			syntaxErrors: 0,
			dnsErrors: 0,
			typosDetected: 0,
		},
		averageScore: 0,
		scoreDistribution: {
			excellent: 0,
			good: 0,
			fair: 0,
			poor: 0,
		},
		startedAt: new Date(Date.now() - totalDuration).toISOString(),
		completedAt: now,
		totalDuration,
		averageDuration: totalDuration / results.length,
	};

	let totalScore = 0;

	for (const result of results) {
		stats[result.state]++;

		if (result.checks.disposable.isDisposable) stats.breakdown.disposable++;
		if (result.checks.role.isRole) stats.breakdown.roleBased++;
		if (result.checks.freeProvider.isFree) stats.breakdown.freeProvider++;
		if (result.checks.smtp.isCatchAll) stats.breakdown.catchAll++;
		if (!result.checks.syntax.valid) stats.breakdown.syntaxErrors++;
		if (!result.checks.dns.valid) stats.breakdown.dnsErrors++;
		if (result.checks.typo.hasTypo) stats.breakdown.typosDetected++;

		if (result.score >= 90) stats.scoreDistribution.excellent++;
		else if (result.score >= 70) stats.scoreDistribution.good++;
		else if (result.score >= 50) stats.scoreDistribution.fair++;
		else stats.scoreDistribution.poor++;

		totalScore += result.score;
	}

	stats.averageScore = Math.round(totalScore / results.length);

	return stats;
}

/**
 * Process bulk verification and store in database
 */
async function processBulkVerification(
	jobId: string,
	organizationId: string,
	userId: string,
	emails: string[],
	options: { skipDisposable?: boolean; skipRole?: boolean; skipTypo?: boolean },
	cookie?: string,
) {
	const startTime = Date.now();

	// Dynamic import to avoid module issues
	const { verifyEmail } = await import("@verifio/email-verify");

	try {
		// Update job status to processing
		await db
			.update(schema.verificationJob)
			.set({ status: "processing", startedAt: new Date() })
			.where(eq(schema.verificationJob.id, jobId));

		const results: VerificationResult[] = [];

		// Process in batches of 10 for concurrency control
		const batchSize = 10;
		for (let i = 0; i < emails.length; i += batchSize) {
			const batch = emails.slice(i, Math.min(i + batchSize, emails.length));
			const batchResults = await Promise.all(
				batch.map((email) =>
					verifyEmail(email, {
						skipDisposable: options.skipDisposable,
						skipRole: options.skipRole,
						skipTypo: options.skipTypo,
					}),
				),
			);

			// Store each result in database
			for (const result of batchResults) {
				await db.insert(schema.verificationResult).values({
					jobId,
					organizationId,
					userId,
					email: result.email,
					state: result.state,
					score: result.score,
					reason: result.reason,
					result: result,
				});
			}

			results.push(...batchResults);

			// Update progress
			await db
				.update(schema.verificationJob)
				.set({ processedEmails: results.length })
				.where(eq(schema.verificationJob.id, jobId));

			logger.info(
				{ jobId, processed: results.length, total: emails.length },
				"Bulk verification progress",
			);
		}

		// Calculate and store stats
		const stats = calculateStats(results, startTime);

		await db
			.update(schema.verificationJob)
			.set({
				status: "completed",
				stats: stats,
				completedAt: new Date(),
			})
			.where(eq(schema.verificationJob.id, jobId));

		logger.info(
			{
				jobId,
				total: results.length,
				deliverable: stats.deliverable,
				duration: stats.totalDuration,
			},
			"Bulk verification completed",
		);

		// Deduct credits after successful completion
		const deductResult = await deductCredits(
			organizationId,
			emails.length,
			cookie,
		);

		if (!deductResult.success) {
			logger.error(
				{ jobId, organizationId, error: deductResult.error },
				"Failed to deduct credits for bulk job",
			);

			// Mark job as failed - credits must be deducted for billing integrity
			await db
				.update(schema.verificationJob)
				.set({
					status: "failed",
					errorMessage:
						"Verification completed but credits deduction failed. Please contact support.",
				})
				.where(eq(schema.verificationJob.id, jobId));

			return;
		}

		// Log activity for completed job
		activityLogger
			.log(
				{
					service: "verify",
					endpoint: "/v1/bulk-verify",
					method: "POST",
					organization_id: organizationId,
					user_id: userId,
					resource_type: "bulk-job",
					resource_id: jobId,
					status: "success",
					result: `completed:${stats.deliverable}/${stats.total}`,
					credits_used: emails.length,
					duration_ms: stats.totalDuration,
					metadata: {
						deliverable: stats.deliverable,
						undeliverable: stats.undeliverable,
						risky: stats.risky,
						unknown: stats.unknown,
					},
				},
				{ cookie },
			)
			.catch(() => {});
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";

		await db
			.update(schema.verificationJob)
			.set({
				status: "failed",
				errorMessage: errorMessage,
			})
			.where(eq(schema.verificationJob.id, jobId));

		logger.error({ jobId, error: errorMessage }, "Bulk verification failed");

		// Log failed activity
		activityLogger
			.log(
				{
					service: "verify",
					endpoint: "/v1/bulk-verify",
					method: "POST",
					organization_id: organizationId,
					user_id: userId,
					resource_type: "bulk-job",
					resource_id: jobId,
					status: "error",
					error_message: errorMessage,
				},
				{ cookie },
			)
			.catch(() => {});
	}
}

export async function createBulkVerifyJobHandler(
	organizationId: string,
	userId: string,
	request: VerifyTypes.BulkVerifyRequest,
	ipAddress?: string,
	userAgent?: string,
	cookie?: string,
): Promise<
	VerifyTypes.BulkVerifyResponse | { success: false; error: string; data?: any }
> {
	const startTime = Date.now();

	try {
		// Check credits before starting bulk job
		const creditCheck = await checkCredits(organizationId, cookie);

		if (
			creditCheck.success === false ||
			!creditCheck.data ||
			creditCheck.data.remaining < request.emails.length
		) {
			return {
				success: false as const,
				error: "Insufficient credits",
				data: {
					remaining: creditCheck.data?.remaining,
					required: request.emails.length,
				},
			};
		}

		logger.info(
			{ organizationId, emailCount: request.emails.length },
			"Starting authenticated bulk verification job",
		);

		const jobResult = await db
			.insert(schema.verificationJob)
			.values({
				organizationId,
				userId,
				name:
					request.name || `Bulk verification - ${request.emails.length} emails`,
				status: "pending",
				totalEmails: request.emails.length,
				processedEmails: 0,
			})
			.returning({ id: schema.verificationJob.id });

		const job = jobResult[0];
		if (!job) {
			return { success: false as const, error: "Failed to create job" };
		}

		// Start processing in background
		processBulkVerification(
			job.id,
			organizationId,
			userId,
			request.emails,
			request.options || {},
			cookie,
		);

		// Log activity
		activityLogger
			.log(
				{
					service: "verify",
					endpoint: "/v1/bulk-verify",
					method: "POST",
					organization_id: organizationId,
					user_id: userId,
					resource_type: "bulk-job",
					resource_id: job.id,
					status: "success",
					result: "created",
					duration_ms: Date.now() - startTime,
					ip_address: ipAddress,
					user_agent: userAgent,
				},
				{ cookie },
			)
			.catch(() => {});

		return {
			success: true as const,
			data: {
				jobId: job.id,
				status: "pending",
				emailCount: request.emails.length,
				message: "Verification job started. Poll status endpoint for progress.",
			},
		};
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";

		logger.error(
			{ organizationId, error: errorMessage },
			"Failed to create bulk verification job",
		);

		activityLogger
			.log(
				{
					service: "verify",
					endpoint: "/v1/bulk-verify",
					method: "POST",
					organization_id: organizationId,
					user_id: userId,
					resource_type: "bulk-job",
					status: "error",
					error_message: errorMessage,
					duration_ms: Date.now() - startTime,
					ip_address: ipAddress,
					user_agent: userAgent,
				},
				{ cookie },
			)
			.catch(() => {});

		return {
			success: false as const,
			error: errorMessage,
		};
	}
}

export async function getBulkJobStatusHandler(
	jobId: string,
	organizationId: string,
) {
	try {
		const [job] = await db
			.select()
			.from(schema.verificationJob)
			.where(eq(schema.verificationJob.id, jobId))
			.limit(1);

		if (!job || job.organizationId !== organizationId) {
			return { success: false as const, error: "Job not found" };
		}

		return {
			success: true as const,
			data: {
				id: job.id,
				name: job.name,
				status: job.status,
				total: job.totalEmails,
				processed: job.processedEmails,
				progress:
					job.totalEmails > 0
						? Math.round((job.processedEmails / job.totalEmails) * 100)
						: 0,
				stats: job.stats,
				createdAt: job.createdAt,
				completedAt: job.completedAt,
				error: job.errorMessage,
			},
		};
	} catch (error) {
		logger.error({ error, jobId }, "Failed to fetch job status");
		return {
			success: false as const,
			error: "Failed to fetch job status",
		};
	}
}

export async function getBulkJobResultsHandler(
	jobId: string,
	organizationId: string,
	page: number,
	limit: number,
) {
	try {
		const [job] = await db
			.select()
			.from(schema.verificationJob)
			.where(eq(schema.verificationJob.id, jobId))
			.limit(1);

		if (!job || job.organizationId !== organizationId) {
			return { success: false as const, error: "Job not found" };
		}

		if (job.status !== "completed") {
			return {
				success: false as const,
				error: `Job is ${job.status}. Results only available when completed.`,
			};
		}

		const offset = (page - 1) * limit;

		// Get total count
		const { count } = await import("drizzle-orm");
		const countResult = await db
			.select({ total: count() })
			.from(schema.verificationResult)
			.where(eq(schema.verificationResult.jobId, jobId));
		const total = countResult[0]?.total ?? 0;

		// Get results
		const { desc } = await import("drizzle-orm");
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
			.where(eq(schema.verificationResult.jobId, jobId))
			.orderBy(desc(schema.verificationResult.createdAt))
			.limit(limit)
			.offset(offset);

		return {
			success: true as const,
			data: {
				results,
				stats: job.stats,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit),
				},
			},
		};
	} catch (error) {
		logger.error({ error, jobId }, "Failed to fetch job results");
		return {
			success: false as const,
			error: "Failed to fetch job results",
		};
	}
}
