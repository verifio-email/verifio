import { verifyEmails } from "@verifio/email-verify";
import { logger } from "@verifio/logger";
import { createRateLimiter } from "@verifio/tools/lib/rate-limiter";
import { Elysia, t } from "elysia";

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
						t.Literal("unknown"),
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

function getScoreCategory(
	score: number,
): "excellent" | "good" | "fair" | "poor" {
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

				const results = await verifyEmails(
					uniqueEmails,
					{
						enableSmtp: false,
						skipDisposable: false,
						skipRole: false,
					},
					10,
				);

				let deliverable = 0;
				let undeliverable = 0;
				let risky = 0;
				let disposable = 0;
				let roleBased = 0;
				let totalScore = 0;

				const issueMap = new Map<string, number>();

				const processedResults = results.map((result) => {
					if (result.state === "deliverable") {
						deliverable++;
					} else if (result.state === "undeliverable") {
						undeliverable++;
					} else {
						risky++;
					}

					const isDisposable = result.checks.disposable?.isDisposable || false;
					if (isDisposable) {
						disposable++;
					}

					const isRole = result.checks.role?.isRole || false;
					if (isRole) {
						roleBased++;
					}

					totalScore += result.score;

					if (result.state !== "deliverable") {
						const issue = result.reason || result.state;
						issueMap.set(issue, (issueMap.get(issue) || 0) + 1);
					}

					const state = result.state as
						| "deliverable"
						| "undeliverable"
						| "risky"
						| "unknown";

					return {
						email: result.email,
						state,
						score: result.score,
						reason: String(result.reason || "Unknown"),
						isDisposable,
						isRole,
					};
				});

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

				const averageScore = Math.round(totalScore / results.length);

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
				summary: "Calculate list health",
				description:
					"Analyzes a list of emails (10-50) and provides comprehensive health scoring",
			},
		},
	);
