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

export async function checkCredits(
	organizationId: string,
	amount = 1,
): Promise<CheckCreditsResponse> {
	try {
		const response = await fetch(
			`${verifyConfig.baseUrl}/api/credits/v1/internal/check`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
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
		return {
			success: false,
			error: "Credits service unavailable - verification blocked for security",
			data: { hasCredits: false, remaining: 0, required: amount },
		};
	}
}

export async function deductCredits(
	organizationId: string,
	amount = 1,
): Promise<DeductCreditsResponse> {
	try {
		const response = await fetch(
			`${verifyConfig.baseUrl}/api/credits/v1/internal/deduct`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
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
		return { success: false, error: "Credits service unavailable" };
	}
}
