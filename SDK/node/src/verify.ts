/**
 * Verifio SDK - Single Email Verification
 */

import type { VerifioClient } from "./client";
import type { ApiResponse, VerificationResult, VerifyOptions } from "./types";

export class VerifyService {
	constructor(private client: VerifioClient) {}

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
	 * console.log(result.state); // 'deliverable' | 'undeliverable' | 'risky' | 'unknown'
	 * console.log(result.score); // 0-100
	 * ```
	 */
	async verify(
		email: string,
		options?: VerifyOptions,
	): Promise<VerificationResult> {
		const response = await this.client.request<ApiResponse<VerificationResult>>(
			"POST",
			"/verify",
			{ email, options },
		);

		if (!response.success || !response.data) {
			throw new Error(response.error || "Verification failed");
		}

		return response.data;
	}
}
