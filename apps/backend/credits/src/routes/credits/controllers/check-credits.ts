/**
 * Check Credits Controller
 */

import { checkCredits } from "@verifio/credits/services/credit-manager";
import type { CreditsTypes } from "@verifio/credits/types/credits.type";

export async function checkCreditsHandler(
  organizationId: string,
  amount: number,
): Promise<CreditsTypes.CheckCreditsResponse> {
  const result = await checkCredits(organizationId, amount);

  return {
    success: true,
    data: result,
  };
}
