/**
 * Credit Manager Service
 * Core business logic for credit operations
 */

import { db } from "@verifio/db/client";
import { creditHistory, orgCredits } from "@verifio/db/schema";
import { desc, eq } from "drizzle-orm";
import { creditsConfig } from "../config";

/**
 * Add 1 month to a date, handling edge cases
 */
function addOneMonth(date: Date): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  return result;
}

/**
 * Credit record type
 */
type OrgCreditsRecord = {
  id: string;
  organizationId: string;
  creditsUsed: number;
  creditLimit: number;
  periodStart: Date;
  periodEnd: Date;
};

/**
 * Get or create credit record for an organization
 * Implements lazy reset: checks if period has expired and resets if needed
 */
export async function getOrCreateOrgCredits(
  organizationId: string,
): Promise<OrgCreditsRecord> {
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
      creditLimit: creditsConfig.defaultCreditLimit,
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
export async function getCreditStatus(organizationId: string) {
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
): Promise<{ hasCredits: boolean; remaining: number; required: number }> {
  const credits = await getOrCreateOrgCredits(organizationId);
  const remaining = credits.creditLimit - credits.creditsUsed;

  return {
    hasCredits: remaining >= amount,
    remaining,
    required: amount,
  };
}

/**
 * Deduct credits from an organization
 * Returns true if deduction was successful, false if insufficient credits
 */
export async function deductCredits(
  organizationId: string,
  amount = 1,
): Promise<{
  success: boolean;
  creditsUsed: number;
  remaining: number;
}> {
  const credits = await getOrCreateOrgCredits(organizationId);
  const remaining = credits.creditLimit - credits.creditsUsed;

  if (remaining < amount) {
    return {
      success: false,
      creditsUsed: credits.creditsUsed,
      remaining,
    };
  }

  const [updated] = await db
    .update(orgCredits)
    .set({
      creditsUsed: credits.creditsUsed + amount,
    })
    .where(eq(orgCredits.id, credits.id))
    .returning();

  if (!updated) {
    throw new Error("Failed to deduct credits");
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
export async function getCreditHistory(organizationId: string, limit = 12) {
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
