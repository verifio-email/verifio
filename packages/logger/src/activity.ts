/**
 * Centralized activity logging for Verifio services
 *
 * Sends activity logs to the centralized logging service for tracking
 * API usage, user actions, and system events.
 */

import { logger } from "./logger.js";
import type { LogActivityParams, Service } from "./types.js";

// Default logging service URL - can be overridden
let loggingServiceUrl =
	process.env.LOGGING_SERVICE_URL || "http://localhost:8003";

/**
 * Set the logging service URL
 */
export function setLoggingServiceUrl(url: string): void {
	loggingServiceUrl = url;
}

/**
 * Get the current logging service URL
 */
export function getLoggingServiceUrl(): string {
	return loggingServiceUrl;
}

/**
 * Log an activity event to the centralized logging service
 *
 * This function is fire-and-forget - it won't throw errors or block
 * the calling code if logging fails.
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
	try {
		const url = `${loggingServiceUrl}/api/logging/v1/log`;

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(params),
		});

		if (!response.ok) {
			logger.warn({ status: response.status, url }, "Failed to log activity");
		}
	} catch (error) {
		// Fire and forget - don't throw, just log the warning
		logger.warn(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			"Failed to send activity log",
		);
	}
}

/**
 * Create a tracker instance with a pre-configured service
 *
 * Usage:
 * ```typescript
 * const tracker = createTracker("verify");
 * await tracker.success({
 *   endpoint: "/v1/verify",
 *   method: "POST",
 *   organization_id: "org_123",
 *   resource_id: "test@example.com",
 * });
 * ```
 */
export function createTracker(service: Service, customUrl?: string) {
	const baseUrl = customUrl || loggingServiceUrl;

	return {
		/**
		 * Log an activity for this service
		 */
		async log(params: Omit<LogActivityParams, "service">): Promise<void> {
			return logActivity({
				...params,
				service,
			});
		},

		/**
		 * Helper to track a successful operation
		 */
		async success(
			params: Omit<LogActivityParams, "service" | "status">,
		): Promise<void> {
			return logActivity({
				...params,
				service,
				status: "success",
			});
		},

		/**
		 * Helper to track a failed operation
		 */
		async failed(
			params: Omit<LogActivityParams, "service" | "status">,
		): Promise<void> {
			return logActivity({
				...params,
				service,
				status: "failed",
			});
		},

		/**
		 * Helper to track an error
		 */
		async error(
			params: Omit<LogActivityParams, "service" | "status"> & {
				error_message: string;
			},
		): Promise<void> {
			return logActivity({
				...params,
				service,
				status: "error",
			});
		},
	};
}
