import {
	type AuthenticatedUser,
	authMiddleware,
} from "@verifio/api-key/middleware/auth";
import { ApiKeyModel } from "@verifio/api-key/model/api-key.model";
import { deleteApiKeyHandler } from "@verifio/api-key/routes/api-key/controllers/delete-api-key";
import { Elysia, t } from "elysia";

export const deleteApiKeyRoute = new Elysia().use(authMiddleware).delete(
	"/:id",
	async ({ params: { id }, user }) => {
		const typedUser = user as AuthenticatedUser;
		return await deleteApiKeyHandler(
			id,
			typedUser.activeOrganizationId,
			typedUser.id,
		);
	},
	{
		auth: true,
		params: t.Object({ id: ApiKeyModel.apiKeyIdParam }),
		response: {
			200: t.Object({ message: t.String() }),
			404: ApiKeyModel.apiKeyNotFound,
			403: ApiKeyModel.unauthorized,
		},
		detail: {
			summary: "Delete API key",
			description: "Deletes an API key",
		},
	},
);
