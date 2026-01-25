import { verifyEmail } from "@verifio/email-verify";
import { logger } from "@verifio/logger";
import { Elysia, t } from "elysia";
import { blockRateLimited, createRateLimiter } from "../middleware/rate-limit";

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
 * Response schemas
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
	riskLevel: t.Union([t.Literal("low"), t.Literal("medium"), t.Literal("high")]),
	qualityIndicators: t.Array(t.String()),
	warnings: t.Array(t.String()),
});

const VerificationDataSchema = t.Object({
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
});

const VerificationResponseSchema = t.Union([
	SuccessResponseSchema,
	ErrorResponseSchema,
]);

export const singleVerifyRoute = new Elysia({ prefix: "/v1" })
	.use(createRateLimiter("singleEmail"))
	.use(blockRateLimited)
	.post(
		"/email",
		async ({ body, set }) => {
			const startTime = Date.now();
			const requestId = crypto.randomUUID();

			// Set request ID header for client-side tracing
			set.headers["X-Request-ID"] = requestId;

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
					success: true as const,
					data: result,
					requestId,
				};
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Unknown error";

				logger.error(
					{ email: body.email, error: errorMessage, requestId },
					"Email verification failed",
				);

				// Return generic error to prevent information disclosure
				// Detailed error is logged for debugging with requestId
				return {
					success: false as const,
					error: "Verification failed. Please try again later or contact support with request ID.",
					requestId,
				};
			}
		},
		{
			body: SingleVerifyBody,
			response: VerificationResponseSchema,
			detail: {
				summary: "Verify single email",
				description:
					"Verify a single email address and get comprehensive verification results",
				tags: ["Verification"],
			},
		},
	);
