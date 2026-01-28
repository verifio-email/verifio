/**
 * Disposable Check Route
 */

import { logger } from "@verifio/logger";
import { createRateLimiter } from "@verifio/tools/lib/rate-limiter";
import { ToolsModel } from "@verifio/tools/model/tools.model";
import { checkDisposableHandler } from "@verifio/tools/routes/tools/controllers";
import { Elysia } from "elysia";

export const disposableRoute = new Elysia({ prefix: "/v1" })
  .use(createRateLimiter("disposable"))
  .post(
    "/disposable/check",
    async ({ body }) => {
      try {
        const { email } = body as { email: string };
        return await checkDisposableHandler(email);
      } catch (error) {
        logger.error(
          { error, email: (body as { email: string }).email },
          "Disposable check failed",
        );
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to check disposable email",
        };
      }
    },
    {
      body: ToolsModel.emailBody,
      response: ToolsModel.disposableResponse,
      detail: {
        summary: "Check disposable",
        description:
          "Detects if an email address is from a disposable email provider. Checks against a database of 72,000+ disposable email domains.",
      },
    },
  );
