/**
 * Authentication Middleware
 * Validates user session by calling auth service
 */

import type { Session } from "@verifio/auth/server";
import { logger } from "@verifio/logger";
import { Elysia } from "elysia";
import { creditsConfig } from "../credits.config";

if (creditsConfig.environment !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export const authMiddleware = new Elysia({ name: "credits-auth" }).macro({
  auth: {
    async resolve({ status, request: { headers } }) {
      const authUrl = `${creditsConfig.baseUrl}/api/auth/v1/get-session`;
      const cookie = headers.get("cookie") || "";

      logger.debug(
        {
          baseUrl: creditsConfig.baseUrl,
          authUrl,
          hasCookie: !!cookie,
        },
        "Attempting authentication",
      );

      try {
        const response = await fetch(authUrl, {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            Cookie: cookie,
          }),
        });

        if (!response.ok) {
          logger.error(
            { status: response.status },
            "Auth service returned error status",
          );
          return status(401, { message: "Authentication failed" });
        }

        const session: Session | null = await response.json();

        if (session?.user) {
          // Get active organization from session
          const organizationId =
            session.session?.activeOrganizationId || null;

          return {
            user: session.user,
            session: session.session,
            organizationId,
            userId: session.user.id,
            authMethod: "cookie" as const,
          };
        }

        logger.warn("No session returned from auth service");
        return status(401, { message: "Authentication required" });
      } catch (error) {
        logger.error(
          {
            error: error instanceof Error ? error.message : "Unknown error",
            authUrl,
          },
          "Authentication error",
        );
        return status(401, { message: "Authentication failed" });
      }
    },
  },
});
