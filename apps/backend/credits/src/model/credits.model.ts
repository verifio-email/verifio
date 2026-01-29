import { t } from "elysia";

export namespace CreditsModel {
	// Request schemas
	export const historyQuery = t.Object({
		limit: t.Optional(
			t.String({ description: "Number of history records to return" }),
		),
	});

	export type HistoryQuery = typeof historyQuery.static;



	export const deductCreditsBody = t.Object({
		amount: t.Optional(
			t.Number({ description: "Number of credits to deduct", default: 1 }),
		),
	});

	export type DeductCreditsBody = typeof deductCreditsBody.static;

	// Response schemas
	export const creditStatus = t.Object({
		used: t.Number({ description: "Credits used in current period" }),
		remaining: t.Number({ description: "Remaining credits" }),
		limit: t.Number({ description: "Credit limit" }),
		periodStart: t.String({ description: "Period start date" }),
		periodEnd: t.String({ description: "Period end date" }),
		percentUsed: t.Number({ description: "Percentage of credits used" }),
	});

	export type CreditStatus = typeof creditStatus.static;

	export const creditHistoryEntry = t.Object({
		creditsUsed: t.Number(),
		creditLimit: t.Number(),
		periodStart: t.String(),
		periodEnd: t.String(),
		percentUsed: t.Number(),
	});

	export type CreditHistoryEntry = typeof creditHistoryEntry.static;

	export const creditsResponse = t.Object({
		success: t.Boolean(),
		data: creditStatus,
	});

	export type CreditsResponse = typeof creditsResponse.static;

	export const historyResponse = t.Object({
		success: t.Boolean(),
		data: t.Array(creditHistoryEntry),
	});

	export type HistoryResponse = typeof historyResponse.static;

	export const checkCreditsResponse = t.Object({
		success: t.Boolean(),
		data: t.Object({
			hasCredits: t.Boolean(),
			remaining: t.Number(),
			required: t.Number(),
		}),
	});

	export type CheckCreditsResponse = typeof checkCreditsResponse.static;

	export const deductCreditsResponse = t.Object({
		success: t.Boolean(),
		data: t.Object({
			success: t.Boolean(),
			creditsUsed: t.Number(),
			remaining: t.Number(),
		}),
	});

	export type DeductCreditsResponse = typeof deductCreditsResponse.static;

	export const errorResponse = t.Object({
		success: t.Literal(false),
		error: t.String({ description: "Error message" }),
	});

	export type ErrorResponse = typeof errorResponse.static;

	export const healthResponse = t.Object({
		status: t.String({ description: "Service status" }),
		timestamp: t.String({ description: "Current timestamp" }),
		error: t.Optional(t.String({ description: "Error message if any" })),
	});

	export type HealthResponse = typeof healthResponse.static;
}
