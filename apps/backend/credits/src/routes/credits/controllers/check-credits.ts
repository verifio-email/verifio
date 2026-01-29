import { checkCredits } from "@verifio/credits/services/credit-manager";
import { logger } from "@verifio/logger";

export async function checkCreditsHandler(
	organizationId: string,
) {
	const amount = 1;
	logger.info({ organizationId, amount }, "Checking credits");

	const result = await checkCredits(organizationId, amount);

	logger.info(
		{
			organizationId,
			hasCredits: result.hasCredits,
			remaining: result.remaining,
		},
		"Credits checked",
	);

	return {
		success: true,
		data: result,
	};
}
