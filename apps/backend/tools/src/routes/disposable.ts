/**
 * Disposable Email Detection Route
 * Detects disposable email addresses using @verifio/email-verify package
 */

import { checkDisposable, getDisposableCount } from "@verifio/email-verify";
import { logger } from "@verifio/logger";
import { Elysia, t } from "elysia";
import { createRateLimiter } from "../lib/rate-limiter";

// Request schema
const DisposableCheckBody = t.Object({
	email: t.String({
		minLength: 3,
		maxLength: 320,
		description: "Email address to check",
	}),
});

// Response schema
const DisposableCheckResponse = t.Object({
	success: t.Boolean(),
	data: t.Optional(
		t.Object({
			email: t.String(),
			isDisposable: t.Boolean(),
			domain: t.String(),
			provider: t.Union([t.String(), t.Null()]),
			databaseSize: t.Number(),
			lastUpdated: t.String(),
		}),
	),
	error: t.Optional(t.String()),
});

export const disposableRoute = new Elysia({ prefix: "/v1" })
	.use(createRateLimiter("disposable"))
	.post(
		"/disposable/check",
		async ({ body }) => {
			const startTime = Date.now();

			try {
				const { email } = body as { email: string };

				// Extract domain from email
				const domainMatch = email.match(/@([^@]+)$/);
				if (!domainMatch) {
					return {
						success: false,
						error: "Invalid email format",
					};
				}

				const domain = domainMatch[1].toLowerCase();

				// Check if disposable
				const result = checkDisposable(domain);

				// Get database size
				const databaseSize = getDisposableCount();

				logger.info(
					{
						email,
						domain,
						isDisposable: result.isDisposable,
						provider: result.provider,
						duration: Date.now() - startTime,
					},
					"Disposable email check completed",
				);

				return {
					success: true,
					data: {
						email,
						isDisposable: result.isDisposable,
						domain,
						provider: result.provider || null,
						databaseSize,
						lastUpdated: new Date().toISOString(),
					},
				};
			} catch (error) {
				logger.error(
					{ error, email: (body as { email: string }).email },
					"Disposable check failed",
				);

				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to check disposable email",
				};
			}
		},
		{
			body: DisposableCheckBody,
			response: DisposableCheckResponse,
			detail: {
				summary: "Check disposable email",
				description:
					"Detects if an email address is from a disposable email provider. Checks against a database of 72,000+ disposable email domains.",
				tags: ["Disposable"],
			},
		},
	);
