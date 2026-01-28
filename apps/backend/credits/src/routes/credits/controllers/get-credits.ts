/**
 * Get Credits Controller
 */

import { getCreditStatus } from "@verifio/credits/services/credit-manager";
import type { CreditsTypes } from "@verifio/credits/types/credits.type";

export async function getCreditsHandler(
  organizationId: string,
): Promise<CreditsTypes.CreditsResponse> {
  const status = await getCreditStatus(organizationId);

  return {
    success: true,
    data: status,
  };
}
