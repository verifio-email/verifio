/**
 * @verifio/logger - Logging utilities for Verifio services
 *
 * Provides both console logging (via Pino) and centralized activity logging.
 *
 * Usage:
 * ```typescript
 * import { logger, logActivity, createTracker } from "@verifio/logger";
 *
 * // Console logging
 * logger.info({ userId: "123" }, "User logged in");
 * logger.request("POST", "/api/users");
 * logger.response("POST", "/api/users", 201);
 *
 * // Activity logging
 * await logActivity({
 *   service: "verify",
 *   endpoint: "/v1/verify",
 *   method: "POST",
 *   organization_id: "org_123",
 *   status: "success",
 * });
 *
 * // Create a tracker
 * const tracker = createTracker("verify");
 * await tracker.success({ ... });
 * ```
 */

// Activity logging
export {
	createTracker,
	getLoggingServiceUrl,
	logActivity,
	setLoggingServiceUrl,
} from "./activity.js";
// Core logger
export { default, logger } from "./logger.js";

// Types
export type {
	ActivityLogParams,
	LogActivityParams,
	Service,
	Status,
} from "./types.js";
