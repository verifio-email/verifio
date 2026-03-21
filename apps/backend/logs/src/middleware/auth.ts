import type { Session } from "@verifio/auth/types";
import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { logger } from "@verifio/logger";
import { getKeyPrefix, verifyApiKey } from "@verifio/logs/lib/api-key-hash";
import { logsConfig } from "@verifio/logs/logs.config";
import { and, eq } from "drizzle-orm";
import { Elysia } from "elysia";

export type AuthenticatedUser = Session["user"] & {
	activeOrganizationId: string;
};

if (logsConfig.NODE_ENV !== "production") {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

function extractApiKey(headers: Headers): string | null {
	const authHeader = headers.get("authorization");
	if (authHeader?.startsWith("Bearer ")) {
		return authHeader.slice(7).trim();
	}

	const apiKeyHeader = headers.get("x-api-key");
	if (apiKeyHeader) {
		return apiKeyHeader.trim();
	}

	return null;
}

async function validateApiKey(apiKey: string): Promise<{
	organizationId: string;
	userId: string;
	apiKeyId: string;
} | null> {
	try {
		const keyPrefix = getKeyPrefix(apiKey);
		logger.debug({ keyPrefix }, "Validating API key in logs service");

		const result = await db.query.apikey.findFirst({
			where: and(
				eq(schema.apikey.start, keyPrefix),
				eq(schema.apikey.enabled, true),
			),
		});

		if (!result) {
			logger.warn({ keyPrefix }, "API key not found or disabled");
			return null;
		}

		const storedHash = result.key;
		if (!verifyApiKey(apiKey, storedHash)) {
			logger.warn({ keyPrefix }, "API key hash verification failed");
			return null;
		}

		if (result.expiresAt && new Date(result.expiresAt) < new Date()) {
			logger.warn({ id: result.id }, "API key has expired");
			return null;
		}

		return {
			organizationId: result.organizationId,
			userId: result.userId,
			apiKeyId: result.id,
		};
	} catch (error) {
		logger.error(
			{ error: error instanceof Error ? error.message : String(error) },
			"Error validating API key",
		);
		return null;
	}
}

export const authMiddleware = new Elysia({ name: "logs-auth" }).macro({
	auth: {
		async resolve({ status, request: { headers } }) {
			const apiKey = extractApiKey(headers);
			if (apiKey) {
				logger.debug("Attempting API key authentication");

				const apiKeyAuth = await validateApiKey(apiKey);
				if (apiKeyAuth) {
					return {
						user: {
							id: apiKeyAuth.userId,
							activeOrganizationId: apiKeyAuth.organizationId,
						} as AuthenticatedUser,
						session: null,
						authMethod: "api-key" as const,
					};
				}

				logger.warn("Invalid API key provided");
				return status(401, { message: "Invalid API key" });
			}

			const authUrl = `${logsConfig.BASE_URL}/api/auth/v1/get-session`;
			const cookie = headers.get("cookie") || "";

			logger.debug(
				{
					baseUrl: logsConfig.BASE_URL,
					authUrl,
					hasCookie: !!cookie,
					cookieLength: cookie.length,
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
					if (!session.user.activeOrganizationId) {
						logger.warn(
							{ userId: session.user.id },
							"User is not a member of an organization",
						);
						return status(403, {
							message: "User is not a member of an organization",
						});
					}

					return {
						user: session.user as AuthenticatedUser,
						session: session.session,
						authMethod: "cookie" as const,
					};
				}

				logger.warn("No session returned from auth service");
				return status(401, { message: "Authentication required" });
			} catch (error) {
				logger.error(
					{
						error: error instanceof Error ? error.message : "Unknown error",
						stack: error instanceof Error ? error.stack : undefined,
						authUrl,
					},
					"Authentication error",
				);
				return status(401, { message: "Authentication failed" });
			}
		},
	},
});
