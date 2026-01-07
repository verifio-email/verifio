/**
 * Authenticated Bulk Email Verification Route
 * POST /v1/bulk-verify - Verify multiple emails with results stored in database
 */

import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import {
  type VerificationResult,
  verifyEmail,
} from "@verifio/email-verify";
import { logger } from "@verifio/logger";
import { logActivity } from "@verifio/logging";
import { count, desc, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { verifyConfig } from "../config";
import { authMiddleware } from "../middleware/auth";
import { checkCredits, deductCredits } from "../services/credits-client";

/**
 * Request body schema
 */
const BulkVerifyBody = t.Object({
  emails: t.Array(t.String({ minLength: 1 }), {
    minItems: 1,
    maxItems: verifyConfig.maxBulkEmails,
    description: "Array of email addresses to verify",
  }),
  name: t.Optional(t.String({ description: "Optional job name" })),
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
): schema.BulkVerificationStatsJson {
  const now = new Date().toISOString();
  const totalDuration = Date.now() - startTime;

  const stats: schema.BulkVerificationStatsJson = {
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
 * Process bulk verification and store in database
 */
async function processBulkVerification(
  jobId: string,
  organizationId: string,
  userId: string,
  emails: string[],
  options: { skipDisposable?: boolean; skipRole?: boolean; skipTypo?: boolean },
) {
  const startTime = Date.now();

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
    deductCredits(organizationId, results.length).catch((err) => {
      logger.error({ error: err, jobId }, "Failed to deduct credits for bulk job");
    });

    // Log activity for completed job
    logActivity({
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
    }).catch(() => { });
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
    logActivity({
      service: "verify",
      endpoint: "/v1/bulk-verify",
      method: "POST",
      organization_id: organizationId,
      user_id: userId,
      resource_type: "bulk-job",
      resource_id: jobId,
      status: "error",
      error_message: errorMessage,
    }).catch(() => { });
  }
}

export const authenticatedBulkRoute = new Elysia({
  prefix: "/v1",
  name: "AuthenticatedBulkRoutes",
})
  .use(authMiddleware)
  /**
   * Start authenticated bulk verification job (stores in DB)
   */
  .post(
    "/bulk-verify",
    async ({ body, organizationId, userId, set }) => {
      if (!organizationId || !userId) {
        return {
          success: false,
          error: "Authentication required",
        };
      }

      // Check credits before starting bulk job
      const creditCheck = await checkCredits(organizationId, body.emails.length);
      if (creditCheck.success && creditCheck.data && !creditCheck.data.hasCredits) {
        set.status = 402;
        return {
          success: false,
          error: "Insufficient credits",
          data: {
            remaining: creditCheck.data.remaining,
            required: creditCheck.data.required,
          },
        };
      }

      logger.info(
        { organizationId, emailCount: body.emails.length },
        "Starting authenticated bulk verification job",
      );

      const jobResult = await db
        .insert(schema.verificationJob)
        .values({
          organizationId,
          userId,
          name: body.name || `Bulk verification - ${body.emails.length} emails`,
          status: "pending",
          totalEmails: body.emails.length,
          processedEmails: 0,
        })
        .returning({ id: schema.verificationJob.id });

      const job = jobResult[0];
      if (!job) {
        return { success: false, error: "Failed to create job" };
      }

      // Start processing in background
      processBulkVerification(
        job.id,
        organizationId,
        userId,
        body.emails,
        body.options || {},
      );

      return {
        success: true,
        data: {
          jobId: job.id,
          status: "pending",
          emailCount: body.emails.length,
          message:
            "Verification job started. Poll status endpoint for progress.",
        },
      };
    },
    {
      auth: true,
      body: BulkVerifyBody,
      detail: {
        summary: "Start authenticated bulk verification",
        description:
          "Start a bulk email verification job with results stored in database.",
        tags: ["Bulk Verification"],
      },
    },
  )
  /**
   * Get authenticated job status
   */
  .get(
    "/bulk-jobs/:jobId",
    async ({ params, organizationId }) => {
      if (!organizationId) {
        return { success: false, error: "Authentication required" };
      }

      const [job] = await db
        .select()
        .from(schema.verificationJob)
        .where(eq(schema.verificationJob.id, params.jobId))
        .limit(1);

      if (!job) {
        return { success: false, error: "Job not found" };
      }

      // Ensure job belongs to this organization
      if (job.organizationId !== organizationId) {
        return { success: false, error: "Job not found" };
      }

      return {
        success: true,
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
    },
    {
      auth: true,
      params: t.Object({ jobId: t.String() }),
      detail: {
        summary: "Get job status (authenticated)",
        description: "Get the status of a bulk verification job",
        tags: ["Bulk Verification"],
      },
    },
  )
  /**
   * Get authenticated job results
   */
  .get(
    "/bulk-jobs/:jobId/results",
    async ({ params, query, organizationId }) => {
      if (!organizationId) {
        return { success: false, error: "Authentication required" };
      }

      const [job] = await db
        .select()
        .from(schema.verificationJob)
        .where(eq(schema.verificationJob.id, params.jobId))
        .limit(1);

      if (!job || job.organizationId !== organizationId) {
        return { success: false, error: "Job not found" };
      }

      if (job.status !== "completed") {
        return {
          success: false,
          error: `Job is ${job.status}. Results only available when completed.`,
        };
      }

      const page = Math.max(1, Number(query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(query.limit) || 50));
      const offset = (page - 1) * limit;

      // Get total count
      const countResult = await db
        .select({ total: count() })
        .from(schema.verificationResult)
        .where(eq(schema.verificationResult.jobId, params.jobId));
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
        .where(eq(schema.verificationResult.jobId, params.jobId))
        .orderBy(desc(schema.verificationResult.createdAt))
        .limit(limit)
        .offset(offset);

      return {
        success: true,
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
    },
    {
      auth: true,
      params: t.Object({ jobId: t.String() }),
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
      detail: {
        summary: "Get job results (authenticated)",
        description: "Get results of a completed bulk verification job",
        tags: ["Bulk Verification"],
      },
    },
  );
