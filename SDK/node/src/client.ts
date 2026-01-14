/**
 * Verifio SDK - Core Client
 * HTTP client with authentication and error handling
 */

import {
  AuthenticationError,
  InsufficientCreditsError,
  NotFoundError,
  RateLimitError,
  ServerError,
  ValidationError,
  VerifioError,
} from "./errors";
import type { VerifioConfig } from "./types";

const DEFAULT_BASE_URL = "https://verifio.email";

export class VerifioClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: VerifioConfig) {
    if (!config.apiKey) {
      throw new ValidationError("API key is required");
    }

    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "");
  }

  /**
   * Make an authenticated request to the Verifio API
   */
  async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}/api/verify/v1${path}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json() as { success?: boolean; error?: string; data?: unknown };

      if (!response.ok) {
        this.handleError(response.status, data);
      }

      return data as T;
    } catch (error) {
      if (error instanceof VerifioError) {
        throw error;
      }

      throw new VerifioError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }

  /**
   * Handle API error responses
   */
  private handleError(status: number, data: { error?: string; data?: unknown }): never {
    const message = data.error || "An error occurred";
    const errorData = data.data as { remaining?: number; required?: number } | undefined;

    switch (status) {
      case 401:
        throw new AuthenticationError(message);
      case 402:
        throw new InsufficientCreditsError(
          message,
          errorData?.remaining,
          errorData?.required
        );
      case 404:
        throw new NotFoundError(message);
      case 429:
        throw new RateLimitError(message);
      case 400:
        throw new ValidationError(message);
      case 500:
      case 502:
      case 503:
        throw new ServerError(message);
      default:
        throw new VerifioError(message, status);
    }
  }
}
