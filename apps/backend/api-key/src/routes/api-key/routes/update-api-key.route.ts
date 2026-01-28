import {
	type AuthenticatedUser,
	authMiddleware,
} from "@verifio/api-key/middleware/auth";
import { ApiKeyModel } from "@verifio/api-key/model/api-key.model";
import { updateApiKeyHandler } from "@verifio/api-key/routes/api-key/controllers/update-api-key";
import { Elysia, t } from "elysia";

export const updateApiKeyRoute = new Elysia().use(authMiddleware).patch(
	"/:id",
	async ({ params: { id }, body, user }) => {
		const typedUser = user as AuthenticatedUser;
		return await updateApiKeyHandler(
			id,
			typedUser.activeOrganizationId,
			typedUser.id,
			body,
		);
	},
	{
		auth: true,
		params: t.Object({
			id: ApiKeyModel.apiKeyIdParam,
		}),
		body: ApiKeyModel.updateApiKeyBody,
		response: {
			200: ApiKeyModel.apiKeyResponse,
			404: ApiKeyModel.apiKeyNotFound,
			403: ApiKeyModel.unauthorized,
		},
		detail: {
			summary: "Update API key",
			description: "Updates an existing API key",
		},
	},
);
