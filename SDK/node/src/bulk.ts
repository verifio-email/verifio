/**
 * Verifio SDK - Bulk Email Verification
 */

import type { VerifioClient } from "./client";
import type {
	ApiResponse,
	BulkVerificationJob,
	PaginatedResponse,
	PaginationOptions,
	VerificationResult,
} from "./types";

export class BulkService {
	constructor(private client: VerifioClient) {}

	/**
	 * Start a bulk verification job
	 *
	 * @param emails - Array of email addresses to verify
	 * @returns Bulk job with ID to track progress
	 *
	 * @example
	 * ```typescript
	 * const job = await verifio.bulk.verify(['a@test.com', 'b@test.com']);
	 * console.log(job.id); // Use this to check status
	 * ```
	 */
	async verify(emails: string[]): Promise<BulkVerificationJob> {
		const response = await this.client.request<
			ApiResponse<BulkVerificationJob>
		>("POST", "/bulk", { emails });

		if (!response.success || !response.data) {
			throw new Error(response.error || "Bulk verification failed");
		}

		return response.data;
	}

	/**
	 * Get the status of a bulk verification job
	 *
	 * @param jobId - The job ID returned from verify()
	 * @returns Job status and stats
	 *
	 * @example
	 * ```typescript
	 * const job = await verifio.bulk.getJob('job-123');
	 * console.log(job.status); // 'pending' | 'processing' | 'completed' | 'failed'
	 * console.log(job.stats?.deliverable); // Number of deliverable emails
	 * ```
	 */
	async getJob(jobId: string): Promise<BulkVerificationJob> {
		const response = await this.client.request<
			ApiResponse<BulkVerificationJob>
		>("GET", `/bulk-jobs/${jobId}`);

		if (!response.success || !response.data) {
			throw new Error(response.error || "Failed to get job");
		}

		return response.data;
	}

	/**
	 * Get the results of a completed bulk verification job
	 *
	 * @param jobId - The job ID
	 * @param options - Pagination options
	 * @returns Paginated list of verification results
	 *
	 * @example
	 * ```typescript
	 * const results = await verifio.bulk.getResults('job-123', { page: 1, limit: 50 });
	 * results.items.forEach(r => console.log(r.email, r.state));
	 * ```
	 */
	async getResults(
		jobId: string,
		options?: PaginationOptions,
	): Promise<{
		items: VerificationResult[];
		pagination: {
			page: number;
			limit: number;
			total: number;
			totalPages: number;
		};
	}> {
		const page = options?.page ?? 1;
		const limit = options?.limit ?? 20;

		const response = await this.client.request<
			PaginatedResponse<VerificationResult>
		>("GET", `/bulk-jobs/${jobId}/results?page=${page}&limit=${limit}`);

		if (!response.success || !response.data) {
			throw new Error(response.error || "Failed to get results");
		}

		return response.data;
	}
}
