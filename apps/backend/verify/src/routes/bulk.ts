/**
 * Bulk Email Verification Route
 * POST /v1/bulk - Verify multiple emails
 * Rate limited: 1 request per hour per IP
 */

import { createId } from "@paralleldrive/cuid2";
import {
  type BulkVerificationStats,
  type VerificationResult,
  verifyEmail,
} from "@verifio/email-verify";
import { logger } from "@verifio/logger";
import { Elysia, t } from "elysia";
import { verifyConfig } from "../config";
import {
  blockRateLimited,
  createRateLimiter,
} from "../middleware/rate-limit";

/**
 * In-memory job storage (for demo - use database in production)
 */
const jobs = new Map<
  string,
  {
    id: string;
    status: "pending" | "processing" | "completed" | "failed";
    emails: string[];
    results: VerificationResult[];
    stats: BulkVerificationStats | null;
    createdAt: string;
    completedAt: string | null;
    error: string | null;
  }
>();

/**
 * Request body schema
 */
const BulkVerifyBody = t.Object({
  emails: t.Array(t.String({ minLength: 1 }), {
    minItems: 1,
    maxItems: verifyConfig.maxBulkEmails,
    description: "Array of email addresses to verify",
  }),
  options: t.Optional(
    t.Object({
      skipDisposable: t.Optional(t.Boolean()),
      skipRole: t.Optional(t.Boolean()),
      skipTypo: t.Optional(t.Boolean()),
    }),
  ),
});

/**
 * Calculate stats from results
 */
function calculateStats(
  results: VerificationResult[],
  startTime: number,
): BulkVerificationStats {
  const now = new Date().toISOString();
  const totalDuration = Date.now() - startTime;

  const stats: BulkVerificationStats = {
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
    // Count by state
    stats[result.state]++;

    // Count breakdown
    if (result.checks.disposable.isDisposable) stats.breakdown.disposable++;
    if (result.checks.role.isRole) stats.breakdown.roleBased++;
    if (result.checks.freeProvider.isFree) stats.breakdown.freeProvider++;
    if (result.checks.smtp.isCatchAll) stats.breakdown.catchAll++;
    if (!result.checks.syntax.valid) stats.breakdown.syntaxErrors++;
    if (!result.checks.dns.valid) stats.breakdown.dnsErrors++;
    if (result.checks.typo.hasTypo) stats.breakdown.typosDetected++;

    // Score distribution
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
 * Process bulk verification in background
 */
async function processBulkVerification(
  jobId: string,
  emails: string[],
  options: { skipDisposable?: boolean; skipRole?: boolean; skipTypo?: boolean },
) {
  const job = jobs.get(jobId);
  if (!job) return;

  const startTime = Date.now();
  job.status = "processing";

  try {
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
      results.push(...batchResults);

      // Log progress
      logger.info(
        { jobId, processed: results.length, total: emails.length },
        "Bulk verification progress",
      );
    }

    job.results = results;
    job.stats = calculateStats(results, startTime);
    job.status = "completed";
    job.completedAt = new Date().toISOString();

    logger.info(
      {
        jobId,
        total: results.length,
        deliverable: job.stats.deliverable,
        duration: job.stats.totalDuration,
      },
      "Bulk verification completed",
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    job.status = "failed";
    job.error = errorMessage;

    logger.error({ jobId, error: errorMessage }, "Bulk verification failed");
  }
}

export const bulkVerifyRoute = new Elysia({ prefix: "/v1" })
  .use(createRateLimiter("bulkEmail"))
  .use(blockRateLimited)
  /**
   * Start bulk verification job
   */
  .post(
    "/bulk",
    async ({ body }) => {
      const jobId = createId();

      logger.info(
        { jobId, emailCount: body.emails.length },
        "Starting bulk verification job",
      );

      // Create job
      const job = {
        id: jobId,
        status: "pending" as const,
        emails: body.emails,
        results: [] as VerificationResult[],
        stats: null,
        createdAt: new Date().toISOString(),
        completedAt: null,
        error: null,
      };

      jobs.set(jobId, job);

      // Start processing in background
      processBulkVerification(jobId, body.emails, body.options || {});

      return {
        success: true,
        data: {
          jobId,
          status: "pending",
          emailCount: body.emails.length,
          message:
            "Verification job started. Poll status endpoint for progress.",
        },
      };
    },
    {
      body: BulkVerifyBody,
      detail: {
        summary: "Start bulk verification",
        description:
          "Start a bulk email verification job. Returns job ID for tracking.",
        tags: ["Bulk Verification"],
      },
    },
  )
  /**
   * Get job status
   */
  .get(
    "/jobs/:jobId",
    ({ params }) => {
      const job = jobs.get(params.jobId);

      if (!job) {
        return {
          success: false,
          error: "Job not found",
        };
      }

      return {
        success: true,
        data: {
          id: job.id,
          status: job.status,
          total: job.emails.length,
          processed: job.results.length,
          progress:
            job.emails.length > 0
              ? Math.round((job.results.length / job.emails.length) * 100)
              : 0,
          stats: job.stats,
          createdAt: job.createdAt,
          completedAt: job.completedAt,
          error: job.error,
        },
      };
    },
    {
      params: t.Object({
        jobId: t.String(),
      }),
      detail: {
        summary: "Get job status",
        description: "Get the status and progress of a bulk verification job",
        tags: ["Bulk Verification"],
      },
    },
  )
  /**
   * Get job results
   */
  .get(
    "/jobs/:jobId/results",
    ({ params, query }) => {
      const job = jobs.get(params.jobId);

      if (!job) {
        return {
          success: false,
          error: "Job not found",
        };
      }

      if (job.status !== "completed") {
        return {
          success: false,
          error: `Job is ${job.status}. Results only available when completed.`,
        };
      }

      // Support pagination
      const page = Number(query.page) || 1;
      const limit = Math.min(Number(query.limit) || 100, 1000);
      const start = (page - 1) * limit;
      const end = start + limit;

      const paginatedResults = job.results.slice(start, end);

      return {
        success: true,
        data: {
          results: paginatedResults,
          stats: job.stats,
          pagination: {
            page,
            limit,
            total: job.results.length,
            pages: Math.ceil(job.results.length / limit),
          },
        },
      };
    },
    {
      params: t.Object({
        jobId: t.String(),
      }),
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
      detail: {
        summary: "Get job results",
        description:
          "Get the results of a completed bulk verification job with pagination",
        tags: ["Bulk Verification"],
      },
    },
  );
