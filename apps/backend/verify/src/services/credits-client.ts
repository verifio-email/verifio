import { logger } from "@verifio/logger";
import { db } from "@verifio/db/client";
import { creditHistory, orgCredits } from "@verifio/db/schema";
import { and, eq, sql } from "drizzle-orm";

interface CheckCreditsResponse {
	success: boolean;
	data?: {
		hasCredits: boolean;
		remaining: number;
		required: number;
	};
	error?: string;
}

interface DeductCreditsResponse {
	success: boolean;
	data?: {
		success: boolean;
		creditsUsed: number;
		remaining: number;
	};
	error?: string;
}

function addOneMonth(date: Date): Date {
	const result = new Date(date);
	result.setMonth(result.getMonth() + 1);
	return result;
}

async function getOrCreateOrgCredits(organizationId: string) {
	const now = new Date();

	const existing = await db.query.orgCredits.findFirst({
		where: eq(orgCredits.organizationId, organizationId),
	});

	if (existing) {
		if (now > existing.periodEnd) {
			await db.insert(creditHistory).values({
				organizationId: existing.organizationId,
				creditsUsed: existing.creditsUsed,
				creditLimit: existing.creditLimit,
				periodStart: existing.periodStart,
				periodEnd: existing.periodEnd,
			});

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

	const periodStart = now;
	const periodEnd = addOneMonth(now);

	const [created] = await db
		.insert(orgCredits)
		.values({
			organizationId,
			creditsUsed: 0,
			creditLimit: 3000,
			periodStart,
			periodEnd,
		})
		.returning();

	if (!created) {
		throw new Error("Failed to create credit record");
	}
	return created;
}

export async function checkCredits(
	organizationId: string,
	cookie?: string,
): Promise<CheckCreditsResponse> {
	try {
		const credits = await getOrCreateOrgCredits(organizationId);
		const remaining = credits.creditLimit - credits.creditsUsed;

		return {
			success: true,
			data: {
				hasCredits: remaining >= 1,
				remaining,
				required: 1,
			},
		};
	} catch (error) {
		logger.error(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			"Failed to check credits directly",
		);
		return {
			success: false,
			error: "Credits service unavailable - verification blocked for security",
			data: { hasCredits: false, remaining: 0, required: 1 },
		};
	}
}

export async function deductCredits(
	organizationId: string,
	amount = 1,
	cookie?: string,
): Promise<DeductCreditsResponse> {
	try {
		const credits = await getOrCreateOrgCredits(organizationId);

		const [updated] = await db
			.update(orgCredits)
			.set({ creditsUsed: sql`${orgCredits.creditsUsed} + ${amount}` })
			.where(
				and(
					eq(orgCredits.id, credits.id),
					sql`${orgCredits.creditLimit} - ${orgCredits.creditsUsed} >= ${amount}`,
				),
			)
			.returning();

		if (!updated) {
			const current = await getOrCreateOrgCredits(organizationId);
			return {
				success: true, 
				data: {
					success: false,
					creditsUsed: current.creditsUsed,
					remaining: current.creditLimit - current.creditsUsed,
				},
			};
		}

		return {
			success: true,
			data: {
				success: true,
				creditsUsed: updated.creditsUsed,
				remaining: updated.creditLimit - updated.creditsUsed,
			},
		};
	} catch (error) {
		logger.error(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			"Failed to deduct credits directly",
		);
		return { success: false, error: "Credits service unavailable" };
	}
}
