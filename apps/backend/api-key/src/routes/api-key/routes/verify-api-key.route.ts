import { validateApiKeyHandler } from "@verifio/api-key/routes/api-key/controllers/validate-api-key";
import { Elysia, t } from "elysia";

export const verifyApiKeyRoute = new Elysia().post(
	"/verify",
	async ({ headers, body }) => {
		// Try to get API key from header or body
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
			200: t.Object({
				valid: t.Boolean({
					description: "Whether the API key is valid",
				}),
				apiKey: t.Optional(
					t.Object({
						id: t.String({ description: "Unique API key identifier" }),
						name: t.Union([t.String(), t.Null()], {
							description: "Name for the API key",
						}),
						start: t.Union([t.String(), t.Null()], {
							description: "Start of the API key (for display)",
						}),
						prefix: t.Union([t.String(), t.Null()], {
							description: "API key prefix",
						}),
						organizationId: t.String({
							description: "Organization identifier",
						}),
						userId: t.String({ description: "User identifier" }),
						refillInterval: t.Union([t.Number(), t.Null()], {
							description: "Refill interval in milliseconds",
						}),
						refillAmount: t.Union([t.Number(), t.Null()], {
							description: "Amount to refill per interval",
						}),
						lastRefillAt: t.Union([t.String(), t.Null()], {
							description: "Last refill timestamp",
						}),
						enabled: t.Boolean({
							description: "Whether the API key is enabled",
						}),
						rateLimitEnabled: t.Boolean({
							description: "Whether rate limiting is enabled",
						}),
						rateLimitTimeWindow: t.Number({
							description: "Rate limit time window in milliseconds",
						}),
						rateLimitMax: t.Number({
							description: "Maximum requests per time window",
						}),
						requestCount: t.Number({
							description: "Total request count",
						}),
						remaining: t.Union([t.Number(), t.Null()], {
							description: "Remaining requests",
						}),
						lastRequest: t.Union([t.String(), t.Null()], {
							description: "Last request timestamp",
						}),
						expiresAt: t.Union([t.String(), t.Null()], {
							description: "Expiration date",
						}),
						createdAt: t.String({ description: "Creation timestamp" }),
						updatedAt: t.String({ description: "Last update timestamp" }),
						permissions: t.Union([t.String(), t.Null()], {
							description: "Comma-separated permissions",
						}),
						metadata: t.Union([t.String(), t.Null()], {
							description: "JSON metadata string",
						}),
						createdBy: t.Optional(
							t.Object({
								id: t.String({ description: "User ID" }),
								name: t.Union([t.String(), t.Null()], {
									description: "User name",
								}),
								image: t.Union([t.String(), t.Null()], {
									description: "User avatar",
								}),
								email: t.String({ description: "User email" }),
							}),
						),
					}),
				),
				error: t.Optional(
					t.String({
						description: "Error message if validation failed",
					}),
				),
			}),
		},
		detail: {
			summary: "Verify API key",
			description:
				"Verifies an API key and returns its details if valid. Accepts the key via Authorization header (Bearer token), x-api-key header, or request body.",
		},
	},
);
