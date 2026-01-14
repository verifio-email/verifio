/**
 * Verifio SDK - Verification History
 */

import type { VerifioClient } from "./client";
import type {
  PaginatedResponse,
  PaginationOptions,
  VerificationResult,
} from "./types";

export class HistoryService {
  constructor(private client: VerifioClient) { }

  /**
   * Get verification history
   *
   * @param options - Pagination options
   * @returns Paginated list of past verification results
   *
   * @example
   * ```typescript
   * const history = await verifio.history.list({ page: 1, limit: 20 });
   * console.log(`Total: ${history.pagination.total}`);
   * history.items.forEach(r => console.log(r.email, r.state));
   * ```
   */
  async list(options?: PaginationOptions): Promise<{
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
    >("GET", `/history?page=${page}&limit=${limit}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to get history");
    }

    return response.data;
  }
}
