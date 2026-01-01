/**
 * Authenticated Single Email Verification Route
 * POST /v1/verify - Verify a single email with result stored in database
 */

import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { verifyEmail } from "@verifio/email-verify";
import { logger } from "@verifio/logger";
import { Elysia, t } from "elysia";
import { authMiddleware } from "../middleware/auth";

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
    async ({ body, user, organizationId, userId }) => {
      const startTime = Date.now();

      try {
        logger.info(
          { email: body.email, organizationId, userId },
          "Verifying single email (authenticated)"
        );

        const result = await verifyEmail(body.email, {
          skipDisposable: body.options?.skipDisposable,
          skipRole: body.options?.skipRole,
          skipTypo: body.options?.skipTypo,
        });

        // Store result in database if we have auth context
        if (organizationId && userId) {
          try {
            await db.insert(schema.verificationResult).values({
              organizationId,
              userId,
              email: result.email,
              state: result.state,
              score: result.score,
              reason: result.reason,
              result: result,
            });

            logger.info(
              { email: body.email, organizationId },
              "Verification result stored in database"
            );
          } catch (dbError) {
            // Log but don't fail - verification still succeeded
            logger.error(
              { error: dbError, email: body.email },
              "Failed to store verification result in database"
            );
          }
        }

        logger.info(
          {
            email: body.email,
            state: result.state,
            score: result.score,
            duration: Date.now() - startTime,
          },
          "Email verification completed"
        );

        return {
          success: true,
          data: result,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        logger.error(
          { email: body.email, error: errorMessage },
          "Email verification failed"
        );

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
