/**
 * Email Quality Scoring Algorithm
 * Calculate a 0-100 score based on verification results
 */

import type { RiskLevel, VerificationChecks } from "../types";

/**
 * Scoring weights for each factor
 */
const SCORING_WEIGHTS = {
  domainExists: 20, // Domain resolves in DNS
  hasMx: 20, // Has MX records
  notDisposable: 15, // Not a disposable email
  notRole: 10, // Not a role-based email
  notFree: 5, // Not a free provider (optional quality signal)
  notCatchAll: 10, // Not a catch-all domain
  noTypo: 10, // No typo detected
  smtpValid: 10, // SMTP verification passed (Phase 2)
};

/**
 * Calculate quality score from verification checks
 */
export function calculateScore(checks: VerificationChecks): number {
  // Syntax must be valid to score anything
  if (!checks.syntax.valid) {
    return 0;
  }

  let score = 0;

  // Domain exists
  if (checks.dns.domainExists) {
    score += SCORING_WEIGHTS.domainExists;
  }

  // Has MX records
  if (checks.dns.hasMx) {
    score += SCORING_WEIGHTS.hasMx;
  }

  // Not disposable
  if (!checks.disposable.isDisposable) {
    score += SCORING_WEIGHTS.notDisposable;
  }

  // Not role-based
  if (!checks.role.isRole) {
    score += SCORING_WEIGHTS.notRole;
  }

  // Not free provider (partial points if free but still valid)
  if (!checks.freeProvider.isFree) {
    score += SCORING_WEIGHTS.notFree;
  }

  // Not catch-all (if known)
  if (checks.smtp.isCatchAll === false) {
    score += SCORING_WEIGHTS.notCatchAll;
  } else if (checks.smtp.isCatchAll === null) {
    // Unknown - give partial credit
    score += SCORING_WEIGHTS.notCatchAll * 0.5;
  }

  // No typo detected
  if (!checks.typo.hasTypo) {
    score += SCORING_WEIGHTS.noTypo;
  }

  // SMTP verification passed (Phase 2)
  if (checks.smtp.valid === true) {
    score += SCORING_WEIGHTS.smtpValid;
  } else if (checks.smtp.valid === null) {
    // Not checked - give partial credit
    score += SCORING_WEIGHTS.smtpValid * 0.5;
  }

  // Ensure score is within bounds
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Determine risk level from score and checks
 */
export function determineRiskLevel(
  score: number,
  checks: VerificationChecks,
): RiskLevel {
  // High risk indicators
  if (
    !checks.syntax.valid ||
    !checks.dns.valid ||
    checks.disposable.isDisposable
  ) {
    return "high";
  }

  // Medium risk indicators
  if (checks.role.isRole || checks.typo.hasTypo || score < 50) {
    return "medium";
  }

  // Low risk
  if (score >= 70) {
    return "low";
  }

  return "medium";
}

/**
 * Generate quality indicators (positive signals)
 */
export function getQualityIndicators(checks: VerificationChecks): string[] {
  const indicators: string[] = [];

  if (checks.syntax.valid) {
    indicators.push("valid_syntax");
  }

  if (checks.dns.domainExists) {
    indicators.push("domain_exists");
  }

  if (checks.dns.hasMx) {
    indicators.push("has_mx_records");
  }

  if (!checks.disposable.isDisposable) {
    indicators.push("not_disposable");
  }

  if (!checks.role.isRole) {
    indicators.push("personal_email");
  }

  if (!checks.typo.hasTypo) {
    indicators.push("no_typos");
  }

  if (checks.smtp.valid === true) {
    indicators.push("smtp_verified");
  }

  if (checks.smtp.isCatchAll === false) {
    indicators.push("not_catch_all");
  }

  return indicators;
}

/**
 * Generate warning flags (negative signals)
 */
export function getWarnings(checks: VerificationChecks): string[] {
  const warnings: string[] = [];

  if (!checks.syntax.valid) {
    warnings.push("invalid_syntax");
  }

  if (!checks.dns.valid) {
    warnings.push("invalid_domain");
  }

  if (!checks.dns.hasMx && checks.dns.domainExists) {
    warnings.push("no_mx_records");
  }

  if (checks.disposable.isDisposable) {
    warnings.push("disposable_email");
  }

  if (checks.role.isRole) {
    warnings.push("role_based_email");
  }

  if (checks.freeProvider.isFree) {
    warnings.push("free_email_provider");
  }

  if (checks.typo.hasTypo) {
    warnings.push("possible_typo");
  }

  if (checks.smtp.isCatchAll === true) {
    warnings.push("catch_all_domain");
  }

  if (checks.smtp.valid === false) {
    warnings.push("smtp_rejected");
  }

  return warnings;
}

/**
 * Get score category label
 */
export function getScoreCategory(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  return "Poor";
}
