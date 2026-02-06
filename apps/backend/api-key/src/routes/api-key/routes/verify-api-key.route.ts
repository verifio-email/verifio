import { ApiKeyModel } from "@verifio/api-key/model/api-key.model";
import { validateApiKeyHandler } from "@verifio/api-key/routes/api-key/controllers/verify-api-key";
import { Elysia, t } from "elysia";

export const verifyApiKeyRoute = new Elysia().post(
	"/verify",
	async ({ headers, body }) => {
		const apiKey =
			headers.authorization?.replace("Bearer ", "") ||
			headers["x-api-key"] ||
			body.apiKey;

		if (!apiKey) {
			return {
				valid: false,
				error: "API key is required",
			};
		}

		return await validateApiKeyHandler(apiKey);
	},
	{
		body: t.Object({
			apiKey: t.Optional(
				t.String({
					description: "API key to verify",
				}),
			),
		}),
		response: {
			200: ApiKeyModel.verifyApiKeyResponse,
		},
		detail: {
			summary: "Verify API key",
			description:
				"Verifies an API key and returns its details if valid. Accepts the key via Authorization header (Bearer token), x-api-key header, or request body.",
		},
	},
);
