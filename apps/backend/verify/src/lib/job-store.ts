/**
 * Redis-backed Job Storage
 *
 * Replaces in-memory Map for bulk verification jobs.
 * Benefits:
 * - Persists across server restarts
 * - Supports horizontal scaling (multiple server instances)
 * - Automatic cleanup via TTL (24 hours)
 */

import { RedisCache } from "@verifio/cache/redis-client";
import type {
	BulkVerificationStats,
	VerificationResult,
} from "@verifio/email-verify";
import { logger } from "@verifio/logger";
import { verifyConfig } from "../verify.config";

// Job TTL: 0 = no expiration (jobs kept forever)
// Note: Consider implementing manual cleanup later to avoid Redis memory issues
const JOB_TTL_SECONDS = 0;

// Redis cache instance for job storage
const jobsCache = new RedisCache(
	"bulk-jobs",
	JOB_TTL_SECONDS,
	verifyConfig.redisUrl,
);

/**
 * Job data structure
 */
export interface BulkJob {
	id: string;
	status: "pending" | "processing" | "completed" | "failed";
	emails: string[];
	results: VerificationResult[];
	stats: BulkVerificationStats | null;
	createdAt: string;
	completedAt: string | null;
	error: string | null;
	accessToken: string; // Cryptographically secure token for job authorization
}

/**
 * Save a job to Redis
 */
export async function saveJob(job: BulkJob): Promise<void> {
	try {
		await jobsCache.set(job.id, job, JOB_TTL_SECONDS);
		logger.debug({ jobId: job.id }, "Job saved to Redis");
	} catch (error) {
		logger.error(
			{ jobId: job.id, error: error instanceof Error ? error.message : error },
			"Failed to save job to Redis",
		);
		throw error;
	}
}

/**
 * Get a job from Redis
 */
export async function getJob(jobId: string): Promise<BulkJob | null> {
	try {
		const job = await jobsCache.get<BulkJob>(jobId);
		return job ?? null;
	} catch (error) {
		logger.error(
			{ jobId, error: error instanceof Error ? error.message : error },
			"Failed to get job from Redis",
		);
		return null;
	}
}

/**
 * Update job status
 */
export async function updateJobStatus(
	jobId: string,
	updates: Partial<BulkJob>,
): Promise<void> {
	const job = await getJob(jobId);
	if (!job) {
		logger.warn({ jobId }, "Attempted to update non-existent job");
		return;
	}

	const updatedJob = { ...job, ...updates };
	await saveJob(updatedJob);
}

/**
 * Delete a job from Redis
 */
export async function deleteJob(jobId: string): Promise<void> {
	try {
		await jobsCache.delete(jobId);
		logger.debug({ jobId }, "Job deleted from Redis");
	} catch (error) {
		logger.error(
			{ jobId, error: error instanceof Error ? error.message : error },
			"Failed to delete job from Redis",
		);
	}
}
