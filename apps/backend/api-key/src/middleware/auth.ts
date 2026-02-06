import type { Session } from "@verifio/auth/types";
import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { logger } from "@verifio/logger";
import { and, eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { apiKeyConfig } from "../api-key.config";

export type OrgRole = "owner" | "admin" | "member";

export type AuthenticatedUser = Session["user"] & {
	activeOrganizationId: string;
	role: OrgRole;
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

					// Fetch user's role in the active organization
					const membership = await db.query.member.findFirst({
						where: and(
							eq(schema.member.userId, session.user.id),
							eq(schema.member.organizationId, session.user.activeOrganizationId),
						),
					});

					const role: OrgRole = (membership?.role as OrgRole) || "member";

					logger.info(
						{
							userId: session.user.id,
							organizationId: session.user.activeOrganizationId,
							role,
						},
						"User authenticated with role",
					);

					return {
						user: {
							...session.user,
							role,
						} as AuthenticatedUser,
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
