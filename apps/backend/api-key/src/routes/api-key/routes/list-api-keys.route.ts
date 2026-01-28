import {
	type AuthenticatedUser,
	authMiddleware,
} from "@verifio/api-key/middleware/auth";
import { ApiKeyModel } from "@verifio/api-key/model/api-key.model";
import { listApiKeysHandler } from "@verifio/api-key/routes/api-key/controllers/list-api-keys";
import { Elysia } from "elysia";

export const listApiKeysRoute = new Elysia().use(authMiddleware).get(
	"/",
	async ({ query, user }) => {
		const typedUser = user as AuthenticatedUser;
		return await listApiKeysHandler(
			query,
			typedUser.activeOrganizationId,
			typedUser.id,
		);
	},
	{
		auth: true,
		query: ApiKeyModel.apiKeyQuery,
		response: {
			200: ApiKeyModel.apiKeyListResponse,
			403: ApiKeyModel.unauthorized,
		},
		detail: {
			summary: "List API keys",
			description: "Lists all API keys for the user's organization",
		},
	},
);
