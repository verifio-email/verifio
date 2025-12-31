/**
 * Free Email Provider Detection
 * Check if email uses a free service (Gmail, Yahoo, etc.)
 */

import {
  FREE_EMAIL_PROVIDERS,
  getFreeProviderName,
  isFreeProvider,
} from "../data/free-providers";
import type { FreeProviderCheckResult } from "../types";

/**
 * Check if email is from a free provider
 */
export function checkFreeProvider(domain: string): FreeProviderCheckResult {
  const lowerDomain = domain.toLowerCase();

  if (!isFreeProvider(lowerDomain)) {
    return {
      isFree: false,
    };
  }

  return {
    isFree: true,
    provider: getFreeProviderName(lowerDomain),
  };
}

/**
 * Get total number of free providers tracked
 */
export function getFreeProviderCount(): number {
  return FREE_EMAIL_PROVIDERS.size;
}
