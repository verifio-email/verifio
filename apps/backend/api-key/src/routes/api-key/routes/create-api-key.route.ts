import { authMiddleware } from "@verifio/api-key/middleware/auth";
import { ApiKeyModel } from "@verifio/api-key/model/api-key.model";
import { createApiKeyHandler } from "@verifio/api-key/routes/api-key/controllers/create-api-key";
import { Elysia } from "elysia";

export const createApiKeyRoute = new Elysia().use(authMiddleware).post(
	"/",
	async ({ body, user }) => {
		return await createApiKeyHandler(user.activeOrganizationId, user.id, body);
	},
	{
		auth: true,
		body: ApiKeyModel.createApiKeyBody,
		response: {
			201: ApiKeyModel.apiKeyWithKeyResponse,
			403: ApiKeyModel.unauthorized,
		},
		detail: {
			summary: "Create a new API key",
			description: "Creates a new API key for the user's organization",
		},
	},
);
