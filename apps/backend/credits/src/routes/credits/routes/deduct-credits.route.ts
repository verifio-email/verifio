import type { AuthenticatedUser } from "@verifio/credits/middleware/auth";
import { authMiddleware } from "@verifio/credits/middleware/auth";
import { deductCreditsHandler } from "@verifio/credits/routes/credits/controllers";
import { CreditsModel } from "@verifio/credits/model/credits.model";
import { Elysia } from "elysia";

export const deductCreditsRoute = new Elysia()
	.use(authMiddleware)
	.post(
		"/deduct",
		async ({ body, user }) => {
			const typedUser = user as AuthenticatedUser;
			return await deductCreditsHandler(
				typedUser.activeOrganizationId,
				body.amount ?? 1,
			);
		},
		{
			auth: true,
			body: CreditsModel.deductCreditsBody,
			response: {
				200: CreditsModel.deductCreditsResponse,
			},
			detail: {
				summary: "Deduct credits",
				description: "Deduct credits from your organization",
			},
		},
	);
