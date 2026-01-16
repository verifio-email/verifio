/**
 * Rate Limiting Middleware for Public Endpoints
 * Uses sliding window rate limiting based on IP address
 */

import { logger } from "@verifio/logger";
import { Elysia } from "elysia";

interface RateLimitEntry {
	count: number;
	windowStart: number;
}

// In-memory store for rate limiting (use Redis in production for distributed systems)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(
	() => {
		const now = Date.now();
		for (const [key, entry] of rateLimitStore.entries()) {
			// Remove entries older than 2 hours
			if (now - entry.windowStart > 2 * 60 * 60 * 1000) {
				rateLimitStore.delete(key);
			}
		}
	},
	5 * 60 * 1000,
);

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
 * Check rate limit and return whether request should be allowed
 */
function checkRateLimit(
	key: string,
	maxRequests: number,
	windowMs: number,
): { allowed: boolean; remaining: number; resetAt: number } {
	const now = Date.now();
	const entry = rateLimitStore.get(key);

	if (!entry || now - entry.windowStart > windowMs) {
		// New window
		rateLimitStore.set(key, { count: 1, windowStart: now });
		return {
			allowed: true,
			remaining: maxRequests - 1,
			resetAt: now + windowMs,
		};
	}

	if (entry.count >= maxRequests) {
		return {
			allowed: false,
			remaining: 0,
			resetAt: entry.windowStart + windowMs,
		};
	}

	entry.count++;
	return {
		allowed: true,
		remaining: maxRequests - entry.count,
		resetAt: entry.windowStart + windowMs,
	};
}

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
	// Public single email verification: 2 requests per minute
	singleEmail: {
		maxRequests: 2,
		windowMs: 60 * 1000, // 1 minute
		keyPrefix: "single",
	},
	// Public bulk email verification: 1 request per hour
	bulkEmail: {
		maxRequests: 1,
		windowMs: 60 * 60 * 1000, // 1 hour
		keyPrefix: "bulk",
	},
} as const;

/**
 * Create rate limiting middleware for a specific endpoint type
 */
export function createRateLimiter(type: keyof typeof RATE_LIMITS) {
	const config = RATE_LIMITS[type];

	return new Elysia({ name: `rate-limit-${type}` }).derive(
		{ as: "scoped" },
		({ headers, set }) => {
			const ip = getClientIP(headers);
			const key = `${config.keyPrefix}:${ip}`;

			const result = checkRateLimit(key, config.maxRequests, config.windowMs);

			// Set rate limit headers
			set.headers["X-RateLimit-Limit"] = String(config.maxRequests);
			set.headers["X-RateLimit-Remaining"] = String(result.remaining);
			set.headers["X-RateLimit-Reset"] = String(
				Math.ceil(result.resetAt / 1000),
			);

			if (!result.allowed) {
				const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
				set.headers["Retry-After"] = String(retryAfter);

				logger.warn(
					{ ip, type, retryAfter },
					"Rate limit exceeded for public endpoint",
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
