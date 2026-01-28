/**
 * Deduct Credits Controller
 */

import { deductCredits } from "@verifio/credits/services/credit-manager";
import type { CreditsTypes } from "@verifio/credits/types/credits.type";

export async function deductCreditsHandler(
  organizationId: string,
  amount: number,
): Promise<CreditsTypes.DeductCreditsResponse> {
  const result = await deductCredits(organizationId, amount);

  if (!result.success) {
    return {
      success: false,
      error: "Insufficient credits",
      data: result,
    };
  }

  return {
    success: true,
    data: result,
  };
}
