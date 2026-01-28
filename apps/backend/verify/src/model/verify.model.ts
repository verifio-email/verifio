import { t } from "elysia";

export namespace VerifyModel {
	// Verification options schema
	export const verificationOptions = t.Object({
		skipDisposable: t.Optional(
			t.Boolean({ description: "Skip disposable email check" }),
		),
		skipRole: t.Optional(
			t.Boolean({ description: "Skip role-based email check" }),
		),
		skipTypo: t.Optional(t.Boolean({ description: "Skip typo suggestion" })),
	});

	// Verify email body schema
	export const verifyEmailBody = t.Object({
		email: t.String({
			format: "email",
			minLength: 1,
			maxLength: 254,
			description: "Email address to verify",
		}),
		options: t.Optional(verificationOptions),
	});

	// Bulk verify body schema
	export const bulkVerifyBody = t.Object({
		emails: t.Array(t.String({ minLength: 1 }), {
			minItems: 1,
			maxItems: 1000,
			description: "Array of email addresses to verify",
		}),
		name: t.Optional(t.String({ description: "Optional job name" })),
		options: t.Optional(verificationOptions),
	});

	// Verification checks schemas
	export const syntaxCheckSchema = t.Object({
		valid: t.Boolean(),
		error: t.Optional(t.String()),
	});

	export const dnsCheckSchema = t.Object({
		valid: t.Boolean(),
		domainExists: t.Boolean(),
		hasMx: t.Boolean(),
		mxRecords: t.Array(t.String()),
		preferredMx: t.Optional(t.String()),
		error: t.Optional(t.String()),
	});

	export const disposableCheckSchema = t.Object({
		isDisposable: t.Boolean(),
		provider: t.Optional(t.String()),
	});

	export const roleCheckSchema = t.Object({
		isRole: t.Boolean(),
		role: t.Optional(t.String()),
	});

	export const freeProviderCheckSchema = t.Object({
		isFree: t.Boolean(),
		provider: t.Optional(t.String()),
	});

	export const typoCheckSchema = t.Object({
		hasTypo: t.Boolean(),
		suggestion: t.Optional(t.String()),
		originalDomain: t.Optional(t.String()),
		suggestedDomain: t.Optional(t.String()),
	});

	export const smtpCheckSchema = t.Object({
		valid: t.Union([t.Boolean(), t.Null()]),
		mailboxExists: t.Union([t.Boolean(), t.Null()]),
		isCatchAll: t.Union([t.Boolean(), t.Null()]),
		response: t.Optional(t.String()),
		error: t.Optional(t.String()),
	});

	export const verificationChecksSchema = t.Object({
		syntax: syntaxCheckSchema,
		dns: dnsCheckSchema,
		disposable: disposableCheckSchema,
		role: roleCheckSchema,
		freeProvider: freeProviderCheckSchema,
		typo: typoCheckSchema,
		smtp: smtpCheckSchema,
	});

	export const verificationAnalyticsSchema = t.Object({
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

	export const verificationDataSchema = t.Object({
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
		checks: verificationChecksSchema,
		analytics: verificationAnalyticsSchema,
		duration: t.Number(),
		verifiedAt: t.String(),
	});

	// Response schemas
	export const verifyEmailSuccessResponse = t.Object({
		success: t.Literal(true),
		data: verificationDataSchema,
		requestId: t.String(),
	});

	export const verifyEmailErrorResponse = t.Object({
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

	export const verifyEmailResponse = t.Union([
		verifyEmailSuccessResponse,
		verifyEmailErrorResponse,
	]);

	// Bulk verification stats
	export const bulkVerificationStatsBreakdown = t.Object({
		disposable: t.Number(),
		roleBased: t.Number(),
		freeProvider: t.Number(),
		catchAll: t.Number(),
		syntaxErrors: t.Number(),
		dnsErrors: t.Number(),
		typosDetected: t.Number(),
	});

	export const bulkVerificationStatsScoreDistribution = t.Object({
		excellent: t.Number(),
		good: t.Number(),
		fair: t.Number(),
		poor: t.Number(),
	});

	export const bulkVerificationStats = t.Object({
		total: t.Number(),
		processed: t.Number(),
		deliverable: t.Number(),
		undeliverable: t.Number(),
		risky: t.Number(),
		unknown: t.Number(),
		breakdown: bulkVerificationStatsBreakdown,
		averageScore: t.Number(),
		scoreDistribution: bulkVerificationStatsScoreDistribution,
		startedAt: t.String(),
		completedAt: t.String(),
		totalDuration: t.Number(),
		averageDuration: t.Number(),
	});

	export type BulkVerificationStats = typeof bulkVerificationStats.static;

	// Job schemas
	export const jobSchema = t.Object({
		id: t.String(),
		name: t.Union([t.String(), t.Null()]),
		status: t.Union([
			t.Literal("pending"),
			t.Literal("processing"),
			t.Literal("completed"),
			t.Literal("failed"),
		]),
		totalEmails: t.Number(),
		processedEmails: t.Number(),
		stats: t.Optional(bulkVerificationStats),
		createdAt: t.String(),
		completedAt: t.Union([t.String(), t.Null()]),
		errorMessage: t.Union([t.String(), t.Null()]),
	});

	export type Job = typeof jobSchema.static;

	// Verification result for history
	export const verificationResult = t.Object({
		id: t.String(),
		email: t.String(),
		state: t.Union([
			t.Literal("deliverable"),
			t.Literal("undeliverable"),
			t.Literal("risky"),
			t.Literal("unknown"),
		]),
		score: t.Number(),
		reason: t.String(),
		result: t.Optional(t.Any()),
		createdAt: t.String(),
	});

	export type VerificationResult = typeof verificationResult.static;

	// Query schemas
	export const historyQuery = t.Object({
		page: t.Optional(t.String({ default: "1" })),
		limit: t.Optional(t.String({ default: "20" })),
	});

	export const jobQuery = t.Object({
		page: t.Optional(t.String({ default: "1" })),
		limit: t.Optional(t.String({ default: "10" })),
	});

	// Response schemas for bulk and history
	export const bulkVerifyResponse = t.Object({
		success: t.Literal(true),
		data: t.Object({
			jobId: t.String(),
			status: t.String(),
			emailCount: t.Number(),
			message: t.String(),
		}),
	});

	export const historyResponse = t.Object({
		success: t.Literal(true),
		data: t.Object({
			results: t.Array(verificationResult),
			pagination: t.Object({
				page: t.Number(),
				limit: t.Number(),
				total: t.Number(),
				totalPages: t.Number(),
			}),
		}),
	});

	export const jobsResponse = t.Object({
		success: t.Literal(true),
		data: t.Object({
			jobs: t.Array(jobSchema),
			pagination: t.Object({
				page: t.Number(),
				limit: t.Number(),
				total: t.Number(),
				totalPages: t.Number(),
			}),
		}),
	});

	export const jobStatusResponse = t.Object({
		success: t.Literal(true),
		data: t.Object({
			id: t.String(),
			name: t.Union([t.String(), t.Null()]),
			status: t.Union([
				t.Literal("pending"),
				t.Literal("processing"),
				t.Literal("completed"),
				t.Literal("failed"),
			]),
			total: t.Number(),
			processed: t.Number(),
			progress: t.Number(),
			stats: t.Optional(bulkVerificationStats),
			createdAt: t.String(),
			completedAt: t.Union([t.String(), t.Null()]),
			error: t.Union([t.String(), t.Null()]),
		}),
	});

	// Error response schemas
	export const insufficientCreditsResponse = t.Object({
		success: t.Literal(false),
		error: t.Literal("Insufficient credits"),
		requestId: t.String(),
		data: t.Optional(
			t.Object({
				remaining: t.Number(),
				required: t.Number(),
			}),
		),
	});

	export const unauthorizedResponse = t.Object({
		success: t.Literal(false),
		error: t.String(),
		requestId: t.String(),
	});

	export const notFoundResponse = t.Object({
		success: t.Literal(false),
		error: t.Literal("Job not found"),
	});
}
