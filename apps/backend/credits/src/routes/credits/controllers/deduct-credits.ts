import { deductCredits } from "@verifio/credits/services/credit-manager";
import { logger } from "@verifio/logger";

export async function deductCreditsHandler(
	organizationId: string,
	amount: number,
) {
	logger.info(
		{ organizationId, amount },
		"Deducting credits",
	);

	const result = await deductCredits(organizationId, amount);

	logger.info(
		{ organizationId, success: result.success, creditsUsed: result.creditsUsed, remaining: result.remaining },
		"Credits deducted",
	);

	return {
		success: result.success,
		data: result,
	};
}
