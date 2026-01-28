import {
	type AuthenticatedUser,
	authMiddleware,
} from "@verifio/api-key/middleware/auth";
import { ApiKeyModel } from "@verifio/api-key/model/api-key.model";
import { getApiKeyHandler } from "@verifio/api-key/routes/api-key/controllers/get-api-key";
import { Elysia, t } from "elysia";

export const getApiKeyRoute = new Elysia().use(authMiddleware).get(
	"/:id",
	async ({ params: { id }, user }) => {
		const typedUser = user as AuthenticatedUser;
		return await getApiKeyHandler(
			id,
			typedUser.activeOrganizationId,
			typedUser.id,
		);
	},
	{
		auth: true,
		params: t.Object({
			id: ApiKeyModel.apiKeyIdParam,
		}),
		response: {
			200: ApiKeyModel.apiKeyResponse,
			404: ApiKeyModel.apiKeyNotFound,
			403: ApiKeyModel.unauthorized,
		},
		detail: {
			summary: "Get API key by ID",
			description: "Retrieves an API key by its ID",
		},
	},
);
