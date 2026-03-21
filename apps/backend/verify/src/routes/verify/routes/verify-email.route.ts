import type { AuthenticatedUser } from "@verifio/verify/middleware/auth";
import { authMiddleware } from "@verifio/verify/middleware/auth";
import { VerifyModel } from "@verifio/verify/model/verify.model";
import { verifyEmailHandler } from "@verifio/verify/routes/verify/controllers";
import { Elysia } from "elysia";

export const verifyEmailRoute = new Elysia().use(authMiddleware).post(
	"/verify",
	async ({ body, organizationId, userId, apiKeyId, request, set }) => {
		if (!organizationId) {
			set.status = 401;
			return { success: false, error: "Organization mapping not found" };
		}
		
		const result = await verifyEmailHandler(
			organizationId,
			userId,
			apiKeyId,
			body,
			request.headers.get("x-forwarded-for") || undefined,
			request.headers.get("user-agent") || undefined,
			request.headers.get("cookie") || undefined,
			request.headers.get("authorization") || request.headers.get("x-api-key") || undefined,
		);

		if (!result.success) {
			if (result.error?.includes("Insufficient credits")) {
				set.status = 402;
			} else if (
				result.error?.includes("Invalid email") ||
				result.error?.includes("validation") ||
				result.error?.includes("format")
			) {
				set.status = 400;
			} else if (
				result.error?.includes("SMTP") ||
				result.error?.includes("DNS") ||
				result.error?.includes("timeout") ||
				result.error?.includes("connection")
			) {
				set.status = 503;
			} else {
				set.status = 500;
			}
		}

		return result;
	},
	{
		auth: true,
		body: VerifyModel.verifyEmailBody,
		detail: {
			summary: "Email verification",
			description:
				"Verify a single email address with results stored in database",
		},
	},
);
