/**
 * Credit Manager Service
 * Core business logic for credit operations
 */

import { creditsConfig } from "@verifio/credits/credits.config";
import type { CreditsTypes } from "@verifio/credits/types/credits.type";
import { db } from "@verifio/db/client";
import { creditHistory, orgCredits } from "@verifio/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";

/**
 * Add 1 month to a date, handling edge cases
 */
function addOneMonth(date: Date): Date {
	const result = new Date(date);
	result.setMonth(result.getMonth() + 1);
	return result;
}

/**
 * Get or create credit record for an organization
 * Implements lazy reset: checks if period has expired and resets if needed
 */
export async function getOrCreateOrgCredits(
	organizationId: string,
): Promise<CreditsTypes.OrgCreditsRecord> {
	const now = new Date();

	// Try to find existing credit record
	const existing = await db.query.orgCredits.findFirst({
		where: eq(orgCredits.organizationId, organizationId),
	});

	if (existing) {
		// Check if period has expired (lazy reset)
		if (now > existing.periodEnd) {
			// Archive the current period to history
			await db.insert(creditHistory).values({
				organizationId: existing.organizationId,
				creditsUsed: existing.creditsUsed,
				creditLimit: existing.creditLimit,
				periodStart: existing.periodStart,
				periodEnd: existing.periodEnd,
			});

			// Reset for new period
			const newPeriodStart = now;
			const newPeriodEnd = addOneMonth(now);

			const [updated] = await db
				.update(orgCredits)
				.set({
					creditsUsed: 0,
					periodStart: newPeriodStart,
					periodEnd: newPeriodEnd,
				})
				.where(eq(orgCredits.id, existing.id))
				.returning();

			if (!updated) {
				throw new Error("Failed to reset credit period");
			}

			return updated;
		}

		return existing;
	}

	// Create new credit record for org
	const periodStart = now;
	const periodEnd = addOneMonth(now);

	const [created] = await db
		.insert(orgCredits)
		.values({
			organizationId,
			creditsUsed: 0,
			creditLimit: creditsConfig.DEFAULT_CREDIT_LIMIT,
			periodStart,
			periodEnd,
		})
		.returning();

	if (!created) {
		throw new Error("Failed to create credit record");
	}

	return created;
}

/**
 * Get current credit status for an organization
 */
export async function getCreditStatus(
	organizationId: string,
): Promise<CreditsTypes.CreditStatus> {
	const credits = await getOrCreateOrgCredits(organizationId);

	return {
		used: credits.creditsUsed,
		remaining: credits.creditLimit - credits.creditsUsed,
		limit: credits.creditLimit,
		periodStart: credits.periodStart.toISOString(),
		periodEnd: credits.periodEnd.toISOString(),
		percentUsed: Math.round((credits.creditsUsed / credits.creditLimit) * 100),
	};
}

/**
 * Check if organization has enough credits
 */
export async function checkCredits(
	organizationId: string,
	amount = 1,
): Promise<CreditsTypes.CheckCreditsResult> {
	const credits = await getOrCreateOrgCredits(organizationId);
	const remaining = credits.creditLimit - credits.creditsUsed;

	return {
		hasCredits: remaining >= amount,
		remaining,
		required: amount,
	};
}

/**
 * Deduct credits from an organization (ATOMIC operation)
 * Uses SQL WHERE clause to atomically check and deduct, preventing race conditions.
 * Returns true if deduction was successful, false if insufficient credits.
 */
export async function deductCredits(
	organizationId: string,
	amount = 1,
): Promise<CreditsTypes.DeductCreditsResult> {
	// First ensure the credit record exists (handles lazy reset)
	const credits = await getOrCreateOrgCredits(organizationId);

	// Atomic update: only succeeds if there are enough credits
	// The WHERE clause ensures we don't over-deduct
	const [updated] = await db
		.update(orgCredits)
		.set({
			creditsUsed: sql`${orgCredits.creditsUsed} + ${amount}`,
		})
		.where(
			and(
				eq(orgCredits.id, credits.id),
				// Atomic check: credit_limit - credits_used >= amount
				sql`${orgCredits.creditLimit} - ${orgCredits.creditsUsed} >= ${amount}`,
			),
		)
		.returning();

	// If no rows were updated, it means insufficient credits
	if (!updated) {
		// Re-fetch current state for accurate response
		const current = await getOrCreateOrgCredits(organizationId);
		return {
			success: false,
			creditsUsed: current.creditsUsed,
			remaining: current.creditLimit - current.creditsUsed,
		};
	}

	return {
		success: true,
		creditsUsed: updated.creditsUsed,
		remaining: updated.creditLimit - updated.creditsUsed,
	};
}

/**
 * Get credit history for an organization
 */
export async function getCreditHistory(
	organizationId: string,
	limit = 12,
): Promise<CreditsTypes.CreditHistoryEntry[]> {
	const history = await db.query.creditHistory.findMany({
		where: eq(creditHistory.organizationId, organizationId),
		orderBy: [desc(creditHistory.periodEnd)],
		limit,
	});

	return history.map((h) => ({
		creditsUsed: h.creditsUsed,
		creditLimit: h.creditLimit,
		periodStart: h.periodStart.toISOString(),
		periodEnd: h.periodEnd.toISOString(),
		percentUsed: Math.round((h.creditsUsed / h.creditLimit) * 100),
	}));
}
