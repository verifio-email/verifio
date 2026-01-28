/**
 * Get History Route
 */

import {
	type AuthenticatedUser,
	authMiddleware,
} from "@verifio/credits/middleware/auth";
import { CreditsModel } from "@verifio/credits/model/credits.model";
import { getHistoryHandler } from "@verifio/credits/routes/credits/controllers";
import { Elysia } from "elysia";

export const getHistoryRoute = new Elysia().use(authMiddleware).get(
	"/history",
	async ({ user, query }) => {
		const typedUser = user as AuthenticatedUser;
		const limit = query.limit ? Number.parseInt(query.limit, 10) : 12;
		return await getHistoryHandler(typedUser.activeOrganizationId, limit);
	},
	{
		auth: true,
		query: CreditsModel.historyQuery,
		response: {
			200: CreditsModel.historyResponse,
			400: CreditsModel.errorResponse,
		},
		detail: {
			summary: "Credit history",
			description: "Get past billing period credit usage for the organization",
		},
	},
);
