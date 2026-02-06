import {
	type AuthenticatedUser,
	authMiddleware,
} from "@verifio/api-key/middleware/auth";
import { ApiKeyModel } from "@verifio/api-key/model/api-key.model";
import { rotateApiKeyHandler } from "@verifio/api-key/routes/api-key/controllers/rotate-api-key";
import { Elysia, t } from "elysia";

export const rotateApiKeyRoute = new Elysia().use(authMiddleware).post(
	"/:id/rotate",
	async ({ params: { id }, user }) => {
		const typedUser = user as AuthenticatedUser;
		return await rotateApiKeyHandler(
			id,
			typedUser.activeOrganizationId,
			typedUser.id,
			typedUser.role,
		);
	},
	{
		auth: true,
		params: t.Object({
			id: ApiKeyModel.apiKeyIdParam,
		}),
		response: {
			200: ApiKeyModel.apiKeyWithKeyResponse,
			404: ApiKeyModel.apiKeyNotFound,
			403: ApiKeyModel.unauthorized,
		},
		detail: {
			summary: "Rotate API key",
			description:
				"Generates a new secret for the API key while keeping the same ID",
		},
	},
);
