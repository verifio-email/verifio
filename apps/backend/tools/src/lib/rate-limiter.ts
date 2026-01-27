/**
 * Rate Limiting Middleware for Tools Service
 * Uses Redis for distributed rate limiting (works across multiple server instances)
 */

import { logger } from "@verifio/logger";
import { Elysia } from "elysia";
import { redis } from "./redis";
import { toolsConfig } from "../tools.config";

/**
 * Get client IP address from request headers
 */
function getClientIP(headers: Record<string, string | undefined>): string {
	// Check common proxy headers
	const forwardedFor = headers["x-forwarded-for"];
	if (forwardedFor) {
		const firstIP = forwardedFor.split(",")[0];
		if (firstIP) {
			return firstIP.trim();
		}
	}

	const realIP = headers["x-real-ip"];
	if (realIP) {
		return realIP;
	}

	const cfConnectingIP = headers["cf-connecting-ip"];
	if (cfConnectingIP) {
		return cfConnectingIP;
	}

	// Fallback to a default for local development
	return "127.0.0.1";
}

/**
 * Check rate limit using ATOMIC Redis INCR and return whether request should be allowed
 *
 * SECURITY: Uses atomic increment to prevent race conditions.
 * Old approach (get-then-set) allowed concurrent requests to bypass limits.
 * New approach (INCR) is atomic - no race condition possible.
 */
async function checkRateLimit(
	key: string,
	maxRequests: number,
	windowMs: number,
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
	const now = Date.now();
	const ttlSeconds = Math.ceil(windowMs / 1000);

	try {
		// ATOMIC: incrWithExpiry increments and sets TTL in one operation
		// If key doesn't exist, Redis creates it with value 1 and sets expiry
		// If key exists, Redis atomically increments and returns new count
		const { count, isNew } = await redis.incrWithExpiry(key, ttlSeconds);

		// Calculate reset time (approximate - based on TTL)
		const resetAt = now + windowMs;

		// If this is a new window (count === 1), log it
		if (isNew) {
			logger.debug({ key, maxRequests }, "New rate limit window started");
		}

		// Check if limit exceeded
		if (count > maxRequests) {
			return {
				allowed: false,
				remaining: 0,
				resetAt,
			};
		}

		return {
			allowed: true,
			remaining: maxRequests - count,
			resetAt,
		};
	} catch (error) {
		// SECURITY: Fail-closed - block requests when Redis fails
		// This prevents abuse if Redis is down
		logger.error(
			{ error },
			"Redis rate limit check failed, blocking request for security",
		);
		return {
			allowed: false,
			remaining: 0,
			resetAt: now + windowMs,
		};
	}
}

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
	syntax: {
		maxRequests: toolsConfig.rateLimit.syntaxMax,
		windowMs: toolsConfig.rateLimit.windowMs,
		keyPrefix: "tools:syntax",
	},
	disposable: {
		maxRequests: toolsConfig.rateLimit.disposableMax,
		windowMs: toolsConfig.rateLimit.windowMs,
		keyPrefix: "tools:disposable",
	},
	deliverability: {
		maxRequests: toolsConfig.rateLimit.deliverabilityMax,
		windowMs: toolsConfig.rateLimit.windowMs,
		keyPrefix: "tools:deliverability",
	},
	listHealth: {
		maxRequests: toolsConfig.rateLimit.listHealthMax,
		windowMs: toolsConfig.rateLimit.windowMs * 60, // 1 hour window
		keyPrefix: "tools:list-health",
	},
	catchall: {
		maxRequests: toolsConfig.rateLimit.catchallMax,
		windowMs: toolsConfig.rateLimit.windowMs,
		keyPrefix: "tools:catchall",
	},
} as const;

/**
 * Create rate limiting middleware for a specific endpoint type
 */
export function createRateLimiter(type: keyof typeof RATE_LIMITS) {
	const config = RATE_LIMITS[type];

	return new Elysia({ name: `rate-limit-${type}` }).derive(
		{ as: "scoped" },
		async ({ headers, set }) => {
			const ip = getClientIP(headers);
			const key = `${config.keyPrefix}:${ip}`;

			const result = await checkRateLimit(
				key,
				config.maxRequests,
				config.windowMs,
			);

			// Set rate limit headers
			set.headers["X-RateLimit-Limit"] = String(config.maxRequests);
			set.headers["X-RateLimit-Remaining"] = String(result.remaining);
			set.headers["X-RateLimit-Reset"] = String(
				Math.ceil(result.resetAt / 1000),
			);

			if (!result.allowed) {
				const retryAfter = Math.ceil(
					(result.resetAt - Date.now()) / 1000,
				);
				set.headers["Retry-After"] = String(retryAfter);

				logger.warn(
					{ ip, type, retryAfter },
					"Rate limit exceeded for tools endpoint",
				);

				set.status = 429;
				return {
					rateLimitExceeded: true,
					error: {
						success: false,
						error: "Rate limit exceeded. Please try again later.",
						retryAfter,
					},
				};
			}

			return { rateLimitExceeded: false };
		},
	);
}

/**
 * Middleware to block requests that exceeded rate limit
 */
export const blockRateLimited = new Elysia({
	name: "block-rate-limited",
}).onBeforeHandle((context) => {
	const ctx = context as { rateLimitExceeded?: boolean; error?: unknown };
	if (ctx.rateLimitExceeded) {
		return ctx.error;
	}
});
