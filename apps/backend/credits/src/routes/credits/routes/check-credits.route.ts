import type { AuthenticatedUser } from "@verifio/credits/middleware/auth";
import { authMiddleware } from "@verifio/credits/middleware/auth";
import { CreditsModel } from "@verifio/credits/model/credits.model";
import { checkCreditsHandler } from "@verifio/credits/routes/credits/controllers";
import { Elysia } from "elysia";

export const checkCreditsRoute = new Elysia().use(authMiddleware).get(
	"/available-credits",
	async ({ user }) => {
		const typedUser = user as AuthenticatedUser;
		return await checkCreditsHandler(
			typedUser.activeOrganizationId,
		);
	},
	{
		auth: true,
		response: {
			200: CreditsModel.checkCreditsResponse,
		},
		detail: {
			summary: "Available credits",
			description: "Check if your organization has enough credits",
		},
	},
);
