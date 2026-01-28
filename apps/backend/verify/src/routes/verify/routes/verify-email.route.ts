import { Elysia } from "elysia";
import type { AuthenticatedUser } from "../../../middleware/auth";
import { authMiddleware } from "../../../middleware/auth";
import { VerifyModel } from "../../../model/verify.model";
import { verifyEmailHandler } from "../controllers";

export const verifyEmailRoute = new Elysia().use(authMiddleware).post(
	"/verify",
	async ({ body, user, request, set }) => {
		const typedUser = user as AuthenticatedUser;
		const result = await verifyEmailHandler(
			typedUser.activeOrganizationId,
			typedUser.id,
			typedUser.apiKeyId,
			body,
			request.headers.get("x-forwarded-for") || undefined,
			request.headers.get("user-agent") || undefined,
		);

		// Set appropriate status code
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
			summary: "Verify single email",
			description:
				"Verify a single email address with results stored in database",
		},
	},
);
