/**
 * Internal Routes
 * Service-to-service endpoints for credit operations
 */

import { Elysia, t } from "elysia";
import { creditsConfig } from "../config";
import { checkCredits, deductCredits } from "../services/credit-manager";

/**
 * Internal routes - requires service secret for authentication
 */
export const internalRoute = new Elysia({
  prefix: "/v1/internal",
  name: "InternalRoutes",
})
  .onBeforeHandle(({ request, set }) => {
    // Validate internal service secret
    const secret = request.headers.get("x-internal-secret");
    if (secret !== creditsConfig.internalSecret) {
      set.status = 401;
      return { success: false, error: "Unauthorized" };
    }
  })
  .post(
    "/check",
    async ({ body }) => {
      const result = await checkCredits(body.organizationId, body.amount);

      return {
        success: true,
        data: result,
      };
    },
    {
      body: t.Object({
        organizationId: t.String({ description: "Organization ID" }),
        amount: t.Optional(t.Number({ description: "Number of credits to check", default: 1 })),
      }),
      detail: {
        summary: "Check available credits",
        description: "Check if organization has enough credits (internal use)",
        tags: ["Internal"],
      },
    },
  )
  .post(
    "/deduct",
    async ({ body }) => {
      const result = await deductCredits(body.organizationId, body.amount);

      if (!result.success) {
        return {
          success: false,
          error: "Insufficient credits",
          data: result,
        };
      }

      return {
        success: true,
        data: result,
      };
    },
    {
      body: t.Object({
        organizationId: t.String({ description: "Organization ID" }),
        amount: t.Optional(t.Number({ description: "Number of credits to deduct", default: 1 })),
      }),
      detail: {
        summary: "Deduct credits",
        description: "Deduct credits from organization (internal use)",
        tags: ["Internal"],
      },
    },
  );
