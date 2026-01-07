/**
 * Authenticated Single Email Verification Route
 * POST /v1/verify - Verify a single email with result stored in database
 */

import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { verifyEmail } from "@verifio/email-verify";
import { logger } from "@verifio/logger";
import { logActivity } from "@verifio/logging";
import { Elysia, t } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { checkCredits, deductCredits } from "../services/credits-client";

/**
 * Request body schema
 */
const SingleVerifyBody = t.Object({
  email: t.String({ minLength: 1, description: "Email address to verify" }),
  options: t.Optional(
    t.Object({
      skipDisposable: t.Optional(t.Boolean()),
      skipRole: t.Optional(t.Boolean()),
      skipTypo: t.Optional(t.Boolean()),
    }),
  ),
});

/**
 * Authenticated single verification route - stores results in database
 */
export const authenticatedSingleRoute = new Elysia({
  prefix: "/v1",
  name: "AuthenticatedSingleRoutes",
})
  .use(authMiddleware)
  .post(
    "/verify",
    async ({ body, organizationId, userId, apiKeyId, request, set }) => {
      const startTime = Date.now();

      try {
        // Check credits before verification
        if (organizationId) {
          const creditCheck = await checkCredits(organizationId, 1);
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
        }

        logger.info(
          { email: body.email, organizationId, userId },
          "Verifying single email (authenticated)"
        );

        const result = await verifyEmail(body.email, {
          skipDisposable: body.options?.skipDisposable,
          skipRole: body.options?.skipRole,
          skipTypo: body.options?.skipTypo,
        });

        const duration = Date.now() - startTime;

        // Store result in database if we have auth context
        let resultId: string | undefined;
        if (organizationId && userId) {
          try {
            const [inserted] = await db.insert(schema.verificationResult).values({
              organizationId,
              userId,
              email: result.email,
              state: result.state,
              score: result.score,
              reason: result.reason,
              result: result,
            }).returning({ id: schema.verificationResult.id });

            resultId = inserted?.id;

            logger.info(
              { email: body.email, organizationId, resultId },
              "Verification result stored in database"
            );
          } catch (dbError) {
            // Log but don't fail - verification still succeeded
            logger.error(
              { error: dbError, email: body.email },
              "Failed to store verification result in database"
            );
          }

          // Deduct credits after successful verification
          deductCredits(organizationId, 1).catch((err) => {
            logger.error({ error: err }, "Failed to deduct credits");
          });

          // Log activity for tracking
          logActivity({
            service: "verify",
            endpoint: "/v1/verify",
            method: "POST",
            organization_id: organizationId,
            user_id: userId,
            api_key_id: apiKeyId,
            resource_type: "email",
            resource_id: body.email,
            status: "success",
            result: result.state,
            credits_used: 1,
            duration_ms: duration,
            ip_address: request.headers.get("x-forwarded-for") || undefined,
            user_agent: request.headers.get("user-agent") || undefined,
          }).catch(() => {
            // Fire and forget - don't block on logging
          });
        }

        logger.info(
          {
            email: body.email,
            state: result.state,
            score: result.score,
            duration,
          },
          "Email verification completed"
        );

        return {
          success: true,
          data: {
            ...result,
            id: resultId,
          },
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        const duration = Date.now() - startTime;

        logger.error(
          { email: body.email, error: errorMessage },
          "Email verification failed"
        );

        // Log failed activity
        if (organizationId) {
          logActivity({
            service: "verify",
            endpoint: "/v1/verify",
            method: "POST",
            organization_id: organizationId,
            user_id: userId,
            resource_type: "email",
            resource_id: body.email,
            status: "error",
            error_message: errorMessage,
            duration_ms: duration,
            ip_address: request.headers.get("x-forwarded-for") || undefined,
            user_agent: request.headers.get("user-agent") || undefined,
          }).catch(() => {
            // Fire and forget
          });
        }

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    {
      auth: true,
      body: SingleVerifyBody,
      detail: {
        summary: "Verify single email (authenticated)",
        description:
          "Verify a single email address with results stored in database",
        tags: ["Verification"],
      },
    }
  );
