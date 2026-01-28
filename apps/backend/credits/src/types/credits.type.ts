import type { CreditsModel } from "@verifio/credits/model/credits.model";

export namespace CreditsTypes {
  export type HistoryQuery = typeof CreditsModel.historyQuery.static;
  export type CheckCreditsBody = typeof CreditsModel.checkCreditsBody.static;
  export type DeductCreditsBody = typeof CreditsModel.deductCreditsBody.static;
  export type CreditStatus = typeof CreditsModel.creditStatus.static;
  export type CreditHistoryEntry =
    typeof CreditsModel.creditHistoryEntry.static;
  export type CreditsResponse = typeof CreditsModel.creditsResponse.static;
  export type HistoryResponse = typeof CreditsModel.historyResponse.static;
  export type CheckCreditsResponse =
    typeof CreditsModel.checkCreditsResponse.static;
  export type DeductCreditsResponse =
    typeof CreditsModel.deductCreditsResponse.static;
  export type ErrorResponse = typeof CreditsModel.errorResponse.static;
  export type HealthResponse = typeof CreditsModel.healthResponse.static;

  export interface OrgCreditsRecord {
    id: string;
    organizationId: string;
    creditsUsed: number;
    creditLimit: number;
    periodStart: Date;
    periodEnd: Date;
  }

  export interface CheckCreditsResult {
    hasCredits: boolean;
    remaining: number;
    required: number;
  }

  export interface DeductCreditsResult {
    success: boolean;
    creditsUsed: number;
    remaining: number;
  }
}
