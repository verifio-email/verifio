/**
 * Single Email Verification Route
 * POST /v1/email - Verify a single email address
 * Rate limited: 2 requests per minute per IP
 */

import { verifyEmail } from "@verifio/email-verify";
import { logger } from "@verifio/logger";
import { Elysia, t } from "elysia";
import { blockRateLimited, createRateLimiter } from "../middleware/rate-limit";

/**
 * Request body schema
 */
const SingleVerifyBody = t.Object({
	email: t.String({ minLength: 1, description: "Email address to verify" }),
	options: t.Optional(
		t.Object({
			skipDisposable: t.Optional(t.Boolean()),
			skipRole: t.Optional(t.Boolean()),
			skipTypo: t.Optional(t.Boolean()),
		}),
	),
});

/**
 * Response schema
 */
const VerificationResultSchema = t.Object({
	success: t.Boolean(),
	data: t.Optional(t.Any()),
	error: t.Optional(t.String()),
	retryAfter: t.Optional(t.Number()),
});

export const singleVerifyRoute = new Elysia({ prefix: "/v1" })
	.use(createRateLimiter("singleEmail"))
	.use(blockRateLimited)
	.post(
		"/email",
		async ({ body }) => {
			const startTime = Date.now();

			try {
				logger.info({ email: body.email }, "Verifying single email");

				const result = await verifyEmail(body.email, {
					skipDisposable: body.options?.skipDisposable,
					skipRole: body.options?.skipRole,
					skipTypo: body.options?.skipTypo,
				});

				logger.info(
					{
						email: body.email,
						state: result.state,
						score: result.score,
						duration: Date.now() - startTime,
					},
					"Email verification completed",
				);

				return {
					success: true,
					data: result,
				};
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Unknown error";

				logger.error(
					{ email: body.email, error: errorMessage },
					"Email verification failed",
				);

				return {
					success: false,
					error: errorMessage,
				};
			}
		},
		{
			body: SingleVerifyBody,
			response: VerificationResultSchema,
			detail: {
				summary: "Verify single email",
				description:
					"Verify a single email address and get comprehensive verification results",
				tags: ["Verification"],
			},
		},
	);
