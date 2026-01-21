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
		// SECURITY: Fail-closed - block verifications when credits service is unavailable
		// This prevents abuse if attackers DoS the credits service to get free verifications
		// The trade-off is that legitimate users are blocked during outages, but this is
		// safer than allowing unlimited free usage which causes billing losses
		return {
			success: false,
			error: "Credits service unavailable - verification blocked for security",
			data: { hasCredits: false, remaining: 0, required: amount },
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
