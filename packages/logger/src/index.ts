/**
 * @verifio/logger - Logging utilities for Verifio services
 *
 * Provides both console logging (via Pino) and centralized activity logging.
 *
 * Usage:
 * ```typescript
 * import { logger, ActivityLogger } from "@verifio/logger";
 *
 * // Console logging
 * logger.info({ userId: "123" }, "User logged in");
 * logger.request("POST", "/api/users");
 * logger.response("POST", "/api/users", 201);
 *
 * // Activity logging (new instance-based approach)
 * const activityLogger = new ActivityLogger({ url: "http://localhost:8003" });
 * await activityLogger.log({
 *   service: "verify",
 *   endpoint: "/v1/verify",
 *   method: "POST",
 *   organization_id: "org_123",
 *   status: "success",
 * }, { apiKey: "..." });
 *
 * // Create a tracker
 * const tracker = activityLogger.createTracker("verify");
 * await tracker.success({ ... });
 * ```
 */

// Activity logging
export {
	ActivityLogger,
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
	LogActivityOptions,
	LogActivityParams,
	Service,
	Status,
} from "./types.js";
