/**
 * Disposable Email Detection
 * Check if email uses a temporary/throwaway service
 */

import {
  DISPOSABLE_DOMAINS,
  isDisposableDomain,
} from "../data/disposable-domains";
import type { DisposableCheckResult } from "../types";

/**
 * Well-known disposable email providers with names
 */
const KNOWN_DISPOSABLE_PROVIDERS: Map<string, string> = new Map([
  ["10minutemail.com", "10 Minute Mail"],
  ["guerrillamail.com", "Guerrilla Mail"],
  ["mailinator.com", "Mailinator"],
  ["tempmail.com", "Temp Mail"],
  ["temp-mail.org", "Temp Mail"],
  ["yopmail.com", "YOPmail"],
  ["maildrop.cc", "Maildrop"],
  ["throwaway.email", "Throwaway Email"],
  ["trashmail.com", "Trash Mail"],
  ["fakeinbox.com", "Fake Inbox"],
  ["getnada.com", "Nada"],
  ["sharklasers.com", "Shark Lasers"],
  ["spam4.me", "Spam4.me"],
  ["mailnesia.com", "Mailnesia"],
  ["dispostable.com", "Dispostable"],
  ["dropmail.me", "Dropmail"],
  ["emailondeck.com", "Email On Deck"],
]);

/**
 * Check if email domain is disposable
 */
export function checkDisposable(domain: string): DisposableCheckResult {
  const lowerDomain = domain.toLowerCase();

  const isDisposable = isDisposableDomain(lowerDomain);

  if (!isDisposable) {
    return {
      isDisposable: false,
    };
  }

  // Get provider name if known
  const provider = KNOWN_DISPOSABLE_PROVIDERS.get(lowerDomain);

  return {
    isDisposable: true,
    provider: provider || undefined,
  };
}

/**
 * Get total number of disposable domains tracked
 */
export function getDisposableCount(): number {
  return DISPOSABLE_DOMAINS.size;
}
