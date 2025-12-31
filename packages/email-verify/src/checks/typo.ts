/**
 * Typo Detection and Suggestions
 * Detect common email domain typos and suggest corrections
 */

import { getTypoSuggestion, hasTypo } from "../data/typo-corrections";
import type { TypoCheckResult } from "../types";

/**
 * Check for typos and suggest corrections
 */
export function checkTypo(email: string, domain: string): TypoCheckResult {
  const lowerDomain = domain.toLowerCase();

  // Check if domain has a known typo
  const suggestion = getTypoSuggestion(lowerDomain);

  if (!suggestion) {
    return {
      hasTypo: false,
    };
  }

  // Build the corrected email
  const atIndex = email.lastIndexOf("@");
  const localPart = email.substring(0, atIndex);
  const suggestedEmail = `${localPart}@${suggestion}`;

  return {
    hasTypo: true,
    suggestion: suggestedEmail,
    originalDomain: lowerDomain,
    suggestedDomain: suggestion,
  };
}

/**
 * Quick check if domain has a typo
 */
export function domainHasTypo(domain: string): boolean {
  return hasTypo(domain.toLowerCase());
}
