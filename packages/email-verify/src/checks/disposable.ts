/**
 * Disposable Email Detection
 * Check if email uses a temporary/throwaway service
 *
 * Uses a comprehensive database of 70,000+ disposable domains
 * sourced from FakeFilter, disposable-email-domains, and disposable repositories
 */

import {
	DISPOSABLE_DOMAINS,
	getDisposableProvider,
	isDisposableDomain,
} from "../data/disposable-domains";
import type { DisposableCheckResult } from "../types";

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

	// Get provider name if known (uses comprehensive FakeFilter data)
	const provider = getDisposableProvider(lowerDomain);

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
