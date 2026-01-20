/**
 * Rate Limiting Middleware for Public Endpoints
 * Uses Redis for distributed rate limiting (works across multiple server instances)
 */

import { logger } from "@verifio/logger";
import { Elysia } from "elysia";
import { redis } from "../lib/redis";

interface RateLimitEntry {
	count: number;
	windowStart: number;
}

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
 * Check rate limit using Redis and return whether request should be allowed
 */
async function checkRateLimit(
	key: string,
	maxRequests: number,
	windowMs: number,
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
	const now = Date.now();

	try {
		const entry = await redis.get<RateLimitEntry>(key);

		if (!entry || now - entry.windowStart > windowMs) {
			// New window - set count to 1
			await redis.set(
				key,
				{ count: 1, windowStart: now },
				Math.ceil(windowMs / 1000) + 10, // TTL slightly longer than window
			);
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

		// Increment count
		await redis.set(
			key,
			{ count: entry.count + 1, windowStart: entry.windowStart },
			Math.ceil((entry.windowStart + windowMs - now) / 1000) + 10,
		);

		return {
			allowed: true,
			remaining: maxRequests - entry.count - 1,
			resetAt: entry.windowStart + windowMs,
		};
	} catch (error) {
		// If Redis fails, allow the request but log the error
		logger.error({ error }, "Redis rate limit check failed, allowing request");
		return {
			allowed: true,
			remaining: maxRequests - 1,
			resetAt: now + windowMs,
		};
	}
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
		async ({ headers, set }) => {
			const ip = getClientIP(headers);
			const key = `${config.keyPrefix}:${ip}`;

			const result = await checkRateLimit(key, config.maxRequests, config.windowMs);

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
