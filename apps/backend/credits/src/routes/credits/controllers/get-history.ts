/**
 * Get History Controller
 */

import { getCreditHistory } from "@verifio/credits/services/credit-manager";
import type { CreditsTypes } from "@verifio/credits/types/credits.type";

export async function getHistoryHandler(
	organizationId: string,
	limit: number,
): Promise<CreditsTypes.HistoryResponse> {
	const history = await getCreditHistory(organizationId, limit);

	return {
		success: true,
		data: history,
	};
}
