/**
 * Internal Routes
 * Service-to-service endpoints for credit operations
 */

import { creditsConfig } from "@verifio/credits/credits.config";
import { CreditsModel } from "@verifio/credits/model/credits.model";
import {
  checkCreditsHandler,
  deductCreditsHandler,
} from "@verifio/credits/routes/credits/controllers";
import { Elysia } from "elysia";

export const internalRoute = new Elysia({
  prefix: "/internal",
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
      return await checkCreditsHandler(body.organizationId, body.amount ?? 1);
    },
    {
      body: CreditsModel.checkCreditsBody,
      response: {
        200: CreditsModel.checkCreditsResponse,
      },
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
      return await deductCreditsHandler(body.organizationId, body.amount ?? 1);
    },
    {
      body: CreditsModel.deductCreditsBody,
      response: {
        200: CreditsModel.deductCreditsResponse,
      },
      detail: {
        summary: "Deduct credits",
        description: "Deduct credits from organization (internal use)",
        tags: ["Internal"],
      },
    },
  );
