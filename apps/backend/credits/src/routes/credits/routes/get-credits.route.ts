/**
 * Get Status Route
 */

import {
  type AuthenticatedUser,
  authMiddleware,
} from "@verifio/credits/middleware/auth";
import { CreditsModel } from "@verifio/credits/model/credits.model";
import { getCreditsHandler } from "@verifio/credits/routes/credits/controllers";
import { Elysia } from "elysia";

export const getStatusRoute = new Elysia().use(authMiddleware).get(
  "/status",
  async ({ user }) => {
    const typedUser = user as AuthenticatedUser;
    return await getCreditsHandler(typedUser.activeOrganizationId);
  },
  {
    auth: true,
    response: {
      200: CreditsModel.creditsResponse,
      400: CreditsModel.errorResponse,
    },
    detail: {
      summary: "Current credit status",
      description: "Get current credit usage and limits for the organization",
    },
  },
);
