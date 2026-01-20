/**
 * Credits Client
 * Utility for verify service to call credits service
 */

import { logger } from "@verifio/logger";
import { verifyConfig } from "../verify.config";

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

/**
 * Check if organization has enough credits
 */
export async function checkCredits(
	organizationId: string,
	amount = 1,
): Promise<CheckCreditsResponse> {
	try {
		const response = await fetch(
			`${verifyConfig.creditsServiceUrl}/api/credits/v1/internal/check`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Internal-Secret": verifyConfig.internalSecret,
				},
				body: JSON.stringify({ organizationId, amount }),
			},
		);

		if (!response.ok) {
			logger.error(
				{ status: response.status, organizationId },
				"Credits check failed",
			);
			return { success: false, error: "Credits service unavailable" };
		}

		return await response.json();
	} catch (error) {
		logger.error(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			"Failed to check credits",
		);
		// Return success with credits available to avoid blocking if service is down
		// This is a graceful degradation - we don't want to block verifications if credits service is temporarily unavailable
		return {
			success: true,
			data: { hasCredits: true, remaining: 9999, required: amount },
		};
	}
}

/**
 * Deduct credits from organization after successful verification
 */
export async function deductCredits(
	organizationId: string,
	amount = 1,
): Promise<DeductCreditsResponse> {
	try {
		const response = await fetch(
			`${verifyConfig.creditsServiceUrl}/api/credits/v1/internal/deduct`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Internal-Secret": verifyConfig.internalSecret,
				},
				body: JSON.stringify({ organizationId, amount }),
			},
		);

		if (!response.ok) {
			logger.error(
				{ status: response.status, organizationId },
				"Credits deduction failed",
			);
			return { success: false, error: "Credits service unavailable" };
		}

		return await response.json();
	} catch (error) {
		logger.error(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			"Failed to deduct credits",
		);
		// Log but don't fail - the verification already succeeded
		return { success: false, error: "Credits service unavailable" };
	}
}
