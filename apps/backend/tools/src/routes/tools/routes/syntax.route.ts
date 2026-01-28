import { logger } from "@verifio/logger";
import { createRateLimiter } from "@verifio/tools/lib/rate-limiter";
import { ToolsModel } from "@verifio/tools/model/tools.model";
import { validateSyntaxHandler } from "@verifio/tools/routes/tools/controllers";
import { Elysia } from "elysia";

export const syntaxRoute = new Elysia({ prefix: "/v1" })
	.use(createRateLimiter("syntax"))
	.post(
		"/syntax/validate",
		async ({ body }) => {
			try {
				const { email } = body as { email: string };
				return await validateSyntaxHandler(email);
			} catch (error) {
				logger.error(
					{ error, email: (body as { email: string }).email },
					"Syntax validation failed",
				);
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to validate email syntax",
				};
			}
		},
		{
			body: ToolsModel.emailBody,
			response: ToolsModel.syntaxResponse,
			detail: {
				summary: "Validate syntax",
				description:
					"Validates email format according to RFC 5322 standards. Checks for typos, detects provider, and provides detailed syntax analysis.",
			},
		},
	);
