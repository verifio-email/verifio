/**
 * Syntax Validation Route
 * Validates email syntax using @verifio/email-verify package
 */

import { logger } from "@verifio/logger";
import {
	checkFreeProvider,
	checkTypo,
	isValidEmailSyntax,
	parseEmail,
} from "@verifio/email-verify";
import { Elysia, t } from "elysia";
import { createRateLimiter } from "../lib/rate-limiter";

// Request schema
const SyntaxValidateBody = t.Object({
	email: t.String({
		minLength: 3,
		maxLength: 320,
		description: "Email address to validate",
	}),
});

// Response schema
const SyntaxValidateResponse = t.Object({
	success: t.Boolean(),
	data: t.Optional(
		t.Object({
			valid: t.Boolean(),
			normalized: t.Optional(t.String()),
			parsed: t.Optional(
				t.Object({
					email: t.String(),
					user: t.Optional(t.String()),
					domain: t.Optional(t.String()),
					tag: t.Optional(t.String()),
				}),
			),
			typo: t.Optional(
				t.Object({
					hasTypo: t.Boolean(),
					suggestion: t.Optional(t.String()),
					originalDomain: t.Optional(t.String()),
					suggestedDomain: t.Optional(t.String()),
					correctedEmail: t.Optional(t.String()),
				}),
			),
			provider: t.Union([t.String(), t.Null()]),
			rfcCompliant: t.Boolean(),
			errors: t.Array(t.String()),
			warnings: t.Array(t.String()),
		}),
	),
	error: t.Optional(t.String()),
});

export const syntaxRoute = new Elysia({ prefix: "/v1" })
	.use(createRateLimiter("syntax"))
	.post(
		"/syntax/validate",
		async ({ body }) => {
			const startTime = Date.now();

			try {
				const { email } = body as { email: string };

				// Parse email into components
				const parsed = parseEmail(email);

				// Validate syntax
				const isValid = isValidEmailSyntax(email);

				// Check for typos
				let typo: {
					hasTypo: boolean;
					suggestion?: string;
					originalDomain?: string;
					suggestedDomain?: string;
					correctedEmail?: string;
				} | null = null;

				if (parsed && parsed.domain) {
					const typoCheck = checkTypo(email, parsed.domain);
					if (typoCheck.hasTypo) {
						typo = {
							hasTypo: typoCheck.hasTypo,
							suggestion: typoCheck.suggestion,
							originalDomain: typoCheck.originalDomain,
							suggestedDomain: typoCheck.suggestedDomain,
							correctedEmail: typoCheck.correctedEmail,
						};
					}
				}

				// Detect provider
				let provider: string | null = null;
				if (parsed && parsed.domain) {
					const providerCheck = checkFreeProvider(parsed.domain);
					provider = providerCheck.provider || null;
				}

				// Collect errors and warnings
				const errors: string[] = [];
				const warnings: string[] = [];

				if (!isValid) {
					errors.push("Invalid email format");
				}

				if (!parsed) {
					errors.push("Unable to parse email components");
				}

				if (parsed) {
					// Check for warnings
					if (email.includes("..")) {
						warnings.push("Contains consecutive dots");
					}
					if (email.startsWith(".") || email.endsWith(".")) {
						warnings.push("Starts or ends with a dot");
					}
					if (parsed.tag) {
						warnings.push("Contains plus sign (sub-addressing)");
					}
				}

				// Normalize email
				const normalized = parsed?.email;

				logger.info(
					{
						email,
						valid: isValid,
						provider,
						hasTypo: typo?.hasTypo || false,
						duration: Date.now() - startTime,
					},
					"Syntax validation completed",
				);

				return {
					success: true,
					data: {
						valid: isValid,
						normalized,
						parsed: parsed
							? {
									email: parsed.email,
									user: parsed.user || undefined,
									domain: parsed.domain || undefined,
									tag: parsed.tag || undefined,
								}
							: undefined,
						typo: typo || undefined,
						provider,
						rfcCompliant: isValid,
						errors,
						warnings,
					},
				};
			} catch (error) {
				logger.error({ error, email: (body as { email: string }).email }, "Syntax validation failed");

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
			body: SyntaxValidateBody,
			response: SyntaxValidateResponse,
			detail: {
				summary: "Validate email syntax",
				description:
					"Validates email format according to RFC 5322 standards. Checks for typos, detects provider, and provides detailed syntax analysis.",
				tags: ["Syntax"],
			},
		},
	);
