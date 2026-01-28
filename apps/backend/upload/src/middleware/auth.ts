import type { Session } from "@verifio/auth/types";
import { logger } from "@verifio/logger";
import { errorCodes } from "@verifio/upload/error/upload.error-code";
import { uploadConfig } from "@verifio/upload/upload.config";
import { Elysia } from "elysia";

export type AuthenticatedUser = Session["user"] & {
	activeOrganizationId: string;
};

if (uploadConfig.NODE_ENV !== "production") {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export const authMiddleware = new Elysia({ name: "upload-auth" }).macro({
	auth: {
		async resolve({ status, request: { headers } }) {
			const authUrl = `${uploadConfig.BASE_URL}/api/auth/v1/get-session`;
			const cookie = headers.get("cookie") || "";

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
					return status(401, {
						message: "Authentication failed",
						errorCode: errorCodes.UNAUTHORIZED,
					});
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
							errorCode: errorCodes.NOT_MEMBER_OF_ORGANIZATION,
						});
					}

					return {
						user: session.user as AuthenticatedUser,
						session: session.session,
						authMethod: "cookie" as const,
					};
				}

				return status(401, {
					message: "Authentication required",
					errorCode: errorCodes.UNAUTHORIZED,
				});
			} catch (error) {
				logger.error(
					{
						error: error instanceof Error ? error.message : "Unknown error",
						authUrl,
					},
					"Authentication error",
				);
				return status(401, {
					message: "Authentication failed",
					errorCode: errorCodes.UNAUTHORIZED,
				});
			}
		},
	},
});
