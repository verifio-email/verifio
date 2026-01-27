/**
 * Authenticated Single Email Verification Route
 * POST /v1/verify - Verify a single email with result stored in database
 */

import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { verifyEmail } from "@verifio/email-verify";
import { logActivity, logger } from "@verifio/logger";
import { Elysia, t } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { checkCredits, deductCredits } from "../services/credits-client";

/**
 * Request body schema
 */
const VerificationOptionsSchema = t.Object({
	skipDisposable: t.Optional(
		t.Boolean({ description: "Skip disposable email check" }),
	),
	skipRole: t.Optional(
		t.Boolean({ description: "Skip role-based email check" }),
	),
	skipTypo: t.Optional(t.Boolean({ description: "Skip typo suggestion" })),
});

const SingleVerifyBody = t.Object({
	email: t.String({
		format: "email",
		minLength: 1,
		maxLength: 254,
		description: "Email address to verify",
	}),
	options: t.Optional(VerificationOptionsSchema),
});

/**
 * Response schemas - matching public API for consistency
 */
const SyntaxCheckSchema = t.Object({
	valid: t.Boolean(),
	error: t.Optional(t.String()),
});

const DnsCheckSchema = t.Object({
	valid: t.Boolean(),
	domainExists: t.Boolean(),
	hasMx: t.Boolean(),
	mxRecords: t.Array(t.String()),
	preferredMx: t.Optional(t.String()),
	error: t.Optional(t.String()),
});

const DisposableCheckSchema = t.Object({
	isDisposable: t.Boolean(),
	provider: t.Optional(t.String()),
});

const RoleCheckSchema = t.Object({
	isRole: t.Boolean(),
	role: t.Optional(t.String()),
});

const FreeProviderCheckSchema = t.Object({
	isFree: t.Boolean(),
	provider: t.Optional(t.String()),
});

const TypoCheckSchema = t.Object({
	hasTypo: t.Boolean(),
	suggestion: t.Optional(t.String()),
	originalDomain: t.Optional(t.String()),
	suggestedDomain: t.Optional(t.String()),
});

const SmtpCheckSchema = t.Object({
	valid: t.Union([t.Boolean(), t.Null()]),
	mailboxExists: t.Union([t.Boolean(), t.Null()]),
	isCatchAll: t.Union([t.Boolean(), t.Null()]),
	response: t.Optional(t.String()),
	error: t.Optional(t.String()),
});

const VerificationChecksSchema = t.Object({
	syntax: SyntaxCheckSchema,
	dns: DnsCheckSchema,
	disposable: DisposableCheckSchema,
	role: RoleCheckSchema,
	freeProvider: FreeProviderCheckSchema,
	typo: TypoCheckSchema,
	smtp: SmtpCheckSchema,
});

const VerificationAnalyticsSchema = t.Object({
	didYouMean: t.Union([t.String(), t.Null()]),
	domainAge: t.Union([t.Number(), t.Null()]),
	smtpProvider: t.Union([t.String(), t.Null()]),
	riskLevel: t.Union([
		t.Literal("low"),
		t.Literal("medium"),
		t.Literal("high"),
	]),
	qualityIndicators: t.Array(t.String()),
	warnings: t.Array(t.String()),
});

const VerificationDataSchema = t.Object({
	id: t.Optional(t.String()),
	email: t.String(),
	user: t.String(),
	domain: t.String(),
	tag: t.Union([t.String(), t.Null()]),
	state: t.Union([
		t.Literal("deliverable"),
		t.Literal("undeliverable"),
		t.Literal("risky"),
		t.Literal("unknown"),
	]),
	reason: t.String(),
	score: t.Number({ minimum: 0, maximum: 100 }),
	checks: VerificationChecksSchema,
	analytics: VerificationAnalyticsSchema,
	duration: t.Number(),
	verifiedAt: t.String(),
});

const SuccessResponseSchema = t.Object({
	success: t.Literal(true),
	data: VerificationDataSchema,
	requestId: t.String(),
});

const ErrorResponseSchema = t.Object({
	success: t.Literal(false),
	error: t.String(),
	requestId: t.String(),
	data: t.Optional(
		t.Object({
			remaining: t.Optional(t.Number()),
			required: t.Optional(t.Number()),
		}),
	),
});

const VerificationResponseSchema = t.Union([
	SuccessResponseSchema,
	ErrorResponseSchema,
]);

/**
 * Authenticated single verification route - stores results in database
 */
export const authenticatedSingleRoute = new Elysia({
	prefix: "/v1",
	name: "AuthenticatedSingleRoutes",
})
	.use(authMiddleware)
	.post(
		"/verify",
		async ({ body, organizationId, userId, apiKeyId, request, set }) => {
			const startTime = Date.now();
			const requestId = crypto.randomUUID();

			// Set request ID header for client-side tracing
			set.headers["X-Request-ID"] = requestId;

			try {
				// Check credits before verification
				if (organizationId) {
					const creditCheck = await checkCredits(organizationId, 1);
					if (
						creditCheck.success &&
						creditCheck.data &&
						!creditCheck.data.hasCredits
					) {
						set.status = 402;
						return {
							success: false as const,
							error: "Insufficient credits",
							requestId,
							data: {
								remaining: creditCheck.data.remaining,
								required: creditCheck.data.required,
							},
						};
					}
				}

				logger.info(
					{ email: body.email, organizationId, userId },
					"Verifying single email (authenticated)",
				);

				// Add timeout to prevent hanging on slow SMTP servers
				const VERIFICATION_TIMEOUT = 30000; // 30 seconds
				const result = await Promise.race([
					verifyEmail(body.email, {
						skipDisposable: body.options?.skipDisposable === true,
						skipRole: body.options?.skipRole === true,
						skipTypo: body.options?.skipTypo === true,
					}),
					new Promise<never>((_, reject) =>
						setTimeout(
							() =>
								reject(
									new Error("Verification timeout - request took too long"),
								),
							VERIFICATION_TIMEOUT,
						),
					),
				]);

				const duration = Date.now() - startTime;

				// Store result in database if we have auth context
				let resultId: string | undefined;
				if (organizationId && userId) {
					try {
						const [inserted] = await db
							.insert(schema.verificationResult)
							.values({
								organizationId,
								userId,
								email: result.email,
								state: result.state,
								score: result.score,
								reason: result.reason,
								result: result,
							})
							.returning({ id: schema.verificationResult.id });

						resultId = inserted?.id;

						logger.info(
							{ email: body.email, organizationId, resultId },
							"Verification result stored in database",
						);
					} catch (dbError) {
						// Log but don't fail - verification still succeeded
						logger.error(
							{ error: dbError, email: body.email },
							"Failed to store verification result in database",
						);
					}

					// Deduct credits after successful verification (awaited to ensure deduction)
					const deductResult = await deductCredits(organizationId, 1);
					if (!deductResult.success) {
						logger.error(
							{ organizationId, error: deductResult.error },
							"Failed to deduct credits after verification",
						);
						// Return error - credits must be deducted for billing integrity
						set.status = 500;
						return {
							success: false as const,
							error:
								"Verification completed but credits deduction failed. Please contact support.",
							requestId,
						};
					}

					// Log activity for tracking
					logActivity({
						service: "verify",
						endpoint: "/v1/verify",
						method: "POST",
						organization_id: organizationId,
						user_id: userId,
						api_key_id: apiKeyId,
						resource_type: "email",
						resource_id: body.email,
						status: "success",
						result: result.state,
						credits_used: 1,
						duration_ms: duration,
						ip_address: request.headers.get("x-forwarded-for") || undefined,
						user_agent: request.headers.get("user-agent") || undefined,
					}).catch(() => {
						// Fire and forget - don't block on logging
					});
				}

				logger.info(
					{
						email: body.email,
						state: result.state,
						score: result.score,
						duration,
					},
					"Email verification completed",
				);

				return {
					success: true as const,
					data: {
						...result,
						id: resultId,
					},
					requestId,
				};
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Unknown error";
				const duration = Date.now() - startTime;

				logger.error(
					{ email: body.email, error: errorMessage },
					"Email verification failed",
				);

				// Log failed activity
				if (organizationId) {
					logActivity({
						service: "verify",
						endpoint: "/v1/verify",
						method: "POST",
						organization_id: organizationId,
						user_id: userId,
						resource_type: "email",
						resource_id: body.email,
						status: "error",
						error_message: errorMessage,
						duration_ms: duration,
						ip_address: request.headers.get("x-forwarded-for") || undefined,
						user_agent: request.headers.get("user-agent") || undefined,
					}).catch(() => {
						// Fire and forget
					});
				}

				// Set appropriate HTTP status code based on error type
				if (
					errorMessage.includes("Invalid email") ||
					errorMessage.includes("validation") ||
					errorMessage.includes("format")
				) {
					set.status = 400; // Bad Request - validation error
				} else if (
					errorMessage.includes("SMTP") ||
					errorMessage.includes("DNS") ||
					errorMessage.includes("timeout") ||
					errorMessage.includes("connection")
				) {
					set.status = 503; // Service Unavailable - upstream failure
				} else {
					set.status = 500; // Internal Server Error
				}

				return {
					success: false as const,
					error: errorMessage,
					requestId,
				};
			}
		},
		{
			auth: true,
			body: SingleVerifyBody,
			response: VerificationResponseSchema,
			detail: {
				summary: "Verify single email (authenticated)",
				description:
					"Verify a single email address with results stored in database",
				tags: ["Verification"],
			},
		},
	);
