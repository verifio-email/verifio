/**
 * Get Credits Route
 */

import {
  type AuthenticatedUser,
  authMiddleware,
} from "@verifio/credits/middleware/auth";
import { CreditsModel } from "@verifio/credits/model/credits.model";
import { getCreditsHandler } from "@verifio/credits/routes/credits/controllers";
import { Elysia, status } from "elysia";

export const getCreditsRoute = new Elysia().use(authMiddleware).get(
  "/credits",
  async ({ user }) => {
    const typedUser = user as AuthenticatedUser;
    if (!typedUser.activeOrganizationId) {
      return status(400, {
        success: false,
        error: "Organization not found",
      });
    }

    return await getCreditsHandler(typedUser.activeOrganizationId);
  },
  {
    auth: true,
    response: {
      200: CreditsModel.creditsResponse,
      400: CreditsModel.errorResponse,
    },
    detail: {
      summary: "Get current credit status",
      description: "Get current credit usage and limits for the organization",
      tags: ["Credits"],
    },
  },
);
