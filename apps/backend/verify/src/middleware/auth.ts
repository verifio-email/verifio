/**
 * Authentication Middleware
 * Validates user session by calling auth service OR validates API key
 * Supports both cookie-based session authentication and API key authentication
 */

import type { Session } from "@verifio/auth/server";
import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { logger } from "@verifio/logger";
import { and, eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { verifyConfig } from "../config";

if (verifyConfig.environment !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

/**
 * Extract API key from request headers
 * Checks both Authorization: Bearer and X-API-Key headers
 */
function extractApiKey(headers: Headers): string | null {
  // Check Authorization header first (Bearer token)
  const authHeader = headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  // Fall back to X-API-Key header
  const apiKeyHeader = headers.get("x-api-key");
  if (apiKeyHeader) {
    return apiKeyHeader.trim();
  }

  return null;
}

/**
 * Validate API key and return auth context
 */
async function validateApiKey(apiKey: string): Promise<{
  organizationId: string;
  userId: string;
  apiKeyId: string;
} | null> {
  try {
    logger.debug(
      { apiKey: apiKey.substring(0, 12) + "..." },
      "Validating API key"
    );

    // Find API key by direct comparison
    const result = await db.query.apikey.findFirst({
      where: and(
        eq(schema.apikey.key, apiKey),
        eq(schema.apikey.enabled, true)
      ),
    });

    if (!result) {
      logger.warn(
        { apiKey: apiKey.substring(0, 12) + "..." },
        "API key not found or disabled"
      );
      return null;
    }

    // Check expiration
    if (result.expiresAt && new Date(result.expiresAt) < new Date()) {
      logger.warn({ id: result.id }, "API key has expired");
      return null;
    }

    // Update last request timestamp and increment request count
    const now = new Date();
    await db
      .update(schema.apikey)
      .set({
        lastRequest: now,
        requestCount: (result.requestCount || 0) + 1,
        updatedAt: now,
      })
      .where(eq(schema.apikey.id, result.id));

    logger.info({ id: result.id }, "API key validated successfully");

    return {
      organizationId: result.organizationId,
      userId: result.userId,
      apiKeyId: result.id,
    };
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : String(error) },
      "Error validating API key"
    );
    return null;
  }
}

/**
 * Authenticate via session cookie
 */
async function authenticateWithCookie(cookie: string): Promise<{
  user: Session["user"];
  session: Session["session"];
  organizationId: string | null;
  userId: string;
  authMethod: "cookie";
} | null> {
  const authUrl = `${verifyConfig.baseUrl}/api/auth/v1/get-session`;

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
        "Auth service returned error status"
      );
      return null;
    }

    const session: Session | null = await response.json();

    if (session?.user) {
      const organizationId = session.session?.activeOrganizationId || null;

      return {
        user: session.user,
        session: session.session,
        organizationId,
        userId: session.user.id,
        authMethod: "cookie" as const,
      };
    }

    return null;
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        authUrl,
      },
      "Cookie authentication error"
    );
    return null;
  }
}

export const authMiddleware = new Elysia({ name: "verify-auth" }).macro({
  auth: {
    async resolve({ status, request: { headers } }) {
      const cookie = headers.get("cookie") || "";

      // First, try API key authentication
      const apiKey = extractApiKey(headers);
      if (apiKey) {
        logger.debug("Attempting API key authentication");

        const apiKeyAuth = await validateApiKey(apiKey);
        if (apiKeyAuth) {
          return {
            user: null,
            session: null,
            organizationId: apiKeyAuth.organizationId,
            userId: apiKeyAuth.userId,
            apiKeyId: apiKeyAuth.apiKeyId,
            authMethod: "api-key" as const,
          };
        }

        // API key provided but invalid - return 401
        logger.warn("Invalid API key provided");
        return status(401, { message: "Invalid API key" });
      }

      // Fall back to cookie-based session authentication
      logger.debug(
        {
          baseUrl: verifyConfig.baseUrl,
          hasCookie: !!cookie,
        },
        "Attempting cookie authentication"
      );

      const sessionAuth = await authenticateWithCookie(cookie);
      if (sessionAuth) {
        return sessionAuth;
      }

      logger.warn("No valid authentication provided");
      return status(401, { message: "Authentication required" });
    },
  },
});
