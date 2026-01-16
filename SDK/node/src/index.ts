/**
 * @verifio/sdk
 * Official Node.js SDK for Verifio email verification
 */

import { BulkService } from "./bulk";
import { VerifioClient } from "./client";
import { HistoryService } from "./history";
import type { VerificationResult, VerifioConfig, VerifyOptions } from "./types";
import { VerifyService } from "./verify";

/**
 * Verifio SDK
 *
 * @example
 * ```typescript
 * import { Verifio } from '@verifio/sdk';
 *
 * const verifio = new Verifio({ apiKey: 'your-api-key' });
 *
 * // Single verification
 * const result = await verifio.verify('test@example.com');
 * console.log(result.state); // 'deliverable' | 'undeliverable' | 'risky' | 'unknown'
 *
 * // Bulk verification
 * const job = await verifio.bulk.verify(['a@test.com', 'b@test.com']);
 * console.log(job.id);
 * ```
 */
export class Verifio {
	private client: VerifioClient;
	private verifyService: VerifyService;

	/** Bulk email verification operations */
	public readonly bulk: BulkService;

	/** Verification history operations */
	public readonly history: HistoryService;

	/**
	 * Create a new Verifio SDK instance
	 *
	 * @param config - Configuration options
	 * @param config.apiKey - Your Verifio API key (required)
	 * @param config.baseUrl - API base URL (default: https://verifio.email)
	 */
	constructor(config: VerifioConfig) {
		this.client = new VerifioClient(config);
		this.verifyService = new VerifyService(this.client);
		this.bulk = new BulkService(this.client);
		this.history = new HistoryService(this.client);
	}

	/**
	 * Verify a single email address
	 *
	 * @param email - Email address to verify
	 * @param options - Optional verification options
	 * @returns Verification result with state, score, and detailed checks
	 *
	 * @example
	 * ```typescript
	 * const result = await verifio.verify('test@example.com');
	 *
	 * if (result.state === 'deliverable') {
	 *   console.log('Email is valid!');
	 * }
	 *
	 * console.log(`Score: ${result.score}/100`);
	 * console.log(`Risk: ${result.analytics.riskLevel}`);
	 * ```
	 */
	async verify(
		email: string,
		options?: VerifyOptions,
	): Promise<VerificationResult> {
		return this.verifyService.verify(email, options);
	}
}

// Export main class
export default Verifio;

// Export errors
export {
	AuthenticationError,
	InsufficientCreditsError,
	NotFoundError,
	RateLimitError,
	ServerError,
	ValidationError,
	VerifioError,
} from "./errors";
// Export types
export type {
	ApiResponse,
	BulkJobStatus,
	BulkVerificationJob,
	BulkVerificationStats,
	DisposableCheckResult,
	DnsCheckResult,
	FreeProviderCheckResult,
	PaginatedResponse,
	PaginationOptions,
	RiskLevel,
	RoleCheckResult,
	ScoreDistribution,
	SmtpCheckResult,
	SyntaxCheckResult,
	TypoCheckResult,
	VerificationAnalytics,
	VerificationBreakdown,
	VerificationChecks,
	VerificationReason,
	VerificationResult,
	VerificationState,
	VerifioConfig,
	VerifyOptions,
} from "./types";
