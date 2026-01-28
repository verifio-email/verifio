import type { Session } from "@verifio/auth/types";
import { logger } from "@verifio/logger";
import { Elysia } from "elysia";
import { apiKeyConfig } from "../api-key.config";

export type AuthenticatedUser = Session["user"] & {
	activeOrganizationId: string;
};

if (apiKeyConfig.NODE_ENV !== "production") {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export const authMiddleware = new Elysia({ name: "better-auth" }).macro({
	auth: {
		async resolve({ status, request: { headers } }) {
			const authUrl = `${apiKeyConfig.BASE_URL}/api/auth/v1/get-session`;
			const cookie = headers.get("cookie") || "";

			logger.info(
				{
					baseUrl: apiKeyConfig.BASE_URL,
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

				logger.info(
					{
						status: response.status,
						ok: response.ok,
					},
					"Auth service response",
				);

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
