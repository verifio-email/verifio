/**
 * List Health Calculator Route
 * Analyzes small email lists (10-50 emails) and provides health scoring
 */

import { logger } from "@verifio/logger";
import {
	checkDisposable,
	checkRole,
	isValidEmailSyntax,
	parseEmail,
	verifyEmails,
} from "@verifio/email-verify";
import { Elysia, t } from "elysia";
import { createRateLimiter } from "../lib/rate-limiter";

// Request schema
const ListHealthBody = t.Object({
	emails: t.Array(
		t.String({
			minLength: 3,
			maxLength: 320,
		}),
		{
			minItems: 10,
			maxItems: 50,
			description: "Array of email addresses to analyze",
		},
	),
});

// Response schema
const ListHealthResponse = t.Object({
	success: t.Boolean(),
	data: t.Optional(
		t.Object({
			stats: t.Object({
				total: t.Number(),
				deliverable: t.Number(),
				undeliverable: t.Number(),
				risky: t.Number(),
				disposable: t.Number(),
				roleBased: t.Number(),
				averageScore: t.Number(),
				scoreDistribution: t.Object({
					excellent: t.Number(),
					good: t.Number(),
					fair: t.Number(),
					poor: t.Number(),
				}),
			}),
			topIssues: t.Array(
				t.Object({
					issue: t.String(),
					count: t.Number(),
					percentage: t.Number(),
				}),
			),
			results: t.Array(
				t.Object({
					email: t.String(),
					state: t.Union([
						t.Literal("deliverable"),
						t.Literal("undeliverable"),
						t.Literal("risky"),
					]),
					score: t.Number(),
					reason: t.String(),
					isDisposable: t.Boolean(),
					isRole: t.Boolean(),
				}),
			),
		}),
	),
	error: t.Optional(t.String()),
});

/**
 * Categorize score
 */
function getScoreCategory(score: number): "excellent" | "good" | "fair" | "poor" {
	if (score >= 90) return "excellent";
	if (score >= 70) return "good";
	if (score >= 50) return "fair";
	return "poor";
}

export const listHealthRoute = new Elysia({ prefix: "/v1" })
	.use(createRateLimiter("listHealth"))
	.post(
		"/list-health/calculate",
		async ({ body }) => {
			const startTime = Date.now();

			try {
				const { emails } = body as { emails: string[] };

				// Remove duplicates and empty emails
				const uniqueEmails = [...new Set(emails.filter((e) => e.trim()))];

				if (uniqueEmails.length < 10) {
					return {
						success: false,
						error: "At least 10 unique email addresses are required",
					};
				}

				if (uniqueEmails.length > 50) {
					return {
						success: false,
						error: "Maximum 50 email addresses allowed",
					};
				}

				// Verify emails (without SMTP for free tier)
				const results = await verifyEmails(
					uniqueEmails,
					{
						enableSmtp: false, // Disable SMTP for free tier
						skipDisposable: false,
						skipRole: false,
					},
					10, // concurrency
				);

				// Calculate statistics
				let deliverable = 0;
				let undeliverable = 0;
				let risky = 0;
				let disposable = 0;
				let roleBased = 0;
				let totalScore = 0;

				const issueMap = new Map<string, number>();

				const processedResults = results.map((result) => {
					// Count by state
					if (result.state === "deliverable") {
						deliverable++;
					} else if (result.state === "undeliverable") {
						undeliverable++;
					} else {
						risky++;
					}

					// Count disposable
					const isDisposable = result.checks.disposable?.isDisposable || false;
					if (isDisposable) {
						disposable++;
					}

					// Count role-based
					const isRole = result.checks.role?.isRole || false;
					if (isRole) {
						roleBased++;
					}

					// Accumulate score
					totalScore += result.score;

					// Track issues
					if (result.state !== "deliverable") {
						const issue = result.reason || result.state;
						issueMap.set(issue, (issueMap.get(issue) || 0) + 1);
					}

					return {
						email: result.email,
						state: result.state,
						score: result.score,
						reason: result.reason || "Unknown",
						isDisposable,
						isRole,
					};
				});

				// Calculate score distribution
				const scoreDistribution = {
					excellent: 0,
					good: 0,
					fair: 0,
					poor: 0,
				};

				results.forEach((result) => {
					const category = getScoreCategory(result.score);
					scoreDistribution[category]++;
				});

				// Calculate average score
				const averageScore = Math.round(totalScore / results.length);

				// Convert issue map to array
				const topIssues = Array.from(issueMap.entries())
					.map(([issue, count]) => ({
						issue,
						count,
						percentage: Math.round((count / results.length) * 100),
					}))
					.sort((a, b) => b.count - a.count)
					.slice(0, 5);

				logger.info(
					{
						emailCount: uniqueEmails.length,
						deliverable,
						undeliverable,
						risky,
						averageScore,
						duration: Date.now() - startTime,
					},
					"List health calculation completed",
				);

				return {
					success: true,
					data: {
						stats: {
							total: results.length,
							deliverable,
							undeliverable,
							risky,
							disposable,
							roleBased,
							averageScore,
							scoreDistribution,
						},
						topIssues,
						results: processedResults,
					},
				};
			} catch (error) {
				logger.error({ error }, "List health calculation failed");

				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to calculate list health",
				};
			}
		},
		{
			body: ListHealthBody,
			response: ListHealthResponse,
			detail: {
				summary: "Calculate email list health",
				description:
					"Analyzes a small list of emails (10-50) and provides comprehensive health scoring, breakdown, and risk analysis.",
				tags: ["List Health"],
			},
		},
	);
