/**
 * Credits Routes
 * Public endpoints for retrieving credit information
 */

import { Elysia, t } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { getCreditHistory, getCreditStatus } from "../services/credit-manager";

/**
 * Credits routes - requires authentication
 */
export const creditsRoute = new Elysia({
  prefix: "/v1",
  name: "CreditsRoutes",
})
  .use(authMiddleware)
  .get(
    "/credits",
    async ({ organizationId }) => {
      if (!organizationId) {
        return {
          success: false,
          error: "Organization not found",
        };
      }

      const status = await getCreditStatus(organizationId);

      return {
        success: true,
        data: status,
      };
    },
    {
      auth: true,
      detail: {
        summary: "Get current credit status",
        description: "Get current credit usage and limits for the organization",
        tags: ["Credits"],
      },
    },
  )
  .get(
    "/credits/history",
    async ({ organizationId, query }) => {
      if (!organizationId) {
        return {
          success: false,
          error: "Organization not found",
        };
      }

      const limit = query.limit ? Number.parseInt(query.limit, 10) : 12;
      const history = await getCreditHistory(organizationId, limit);

      return {
        success: true,
        data: history,
      };
    },
    {
      auth: true,
      query: t.Object({
        limit: t.Optional(
          t.String({ description: "Number of history records to return" }),
        ),
      }),
      detail: {
        summary: "Get credit history",
        description:
          "Get past billing period credit usage for the organization",
        tags: ["Credits"],
      },
    },
  );
