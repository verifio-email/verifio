import { logger } from "@verifio/logger";
import { verifyConfig } from "@verifio/verify/verify.config";

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
	cookie?: string,
): Promise<CheckCreditsResponse> {
	try {
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
		};

		if (cookie) {
			headers.Cookie = cookie;
		}

		const response = await fetch(
			`${verifyConfig.baseUrl}/api/credits/v1/available-credits`,
			{
				method: "POST",
				headers,
				body: JSON.stringify({ amount }),
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
	cookie?: string,
): Promise<DeductCreditsResponse> {
	try {
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
		};

		if (cookie) {
			headers.Cookie = cookie;
		}

		const response = await fetch(
			`${verifyConfig.baseUrl}/api/credits/v1/deduct`,
			{
				method: "POST",
				headers,
				body: JSON.stringify({ amount }),
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
