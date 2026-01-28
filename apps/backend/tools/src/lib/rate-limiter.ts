import { logger } from "@verifio/logger";
import { redis } from "@verifio/tools/lib/redis";
import { toolsConfig } from "@verifio/tools/tools.config";
import { Elysia } from "elysia";

function getClientIP(headers: Record<string, string | undefined>): string {
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

	return "127.0.0.1";
}

async function checkRateLimit(
	key: string,
	maxRequests: number,
	windowMs: number,
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
	const now = Date.now();
	const ttlSeconds = Math.ceil(windowMs / 1000);

	try {
		const { count, isNew } = await redis.incrWithExpiry(key, ttlSeconds);
		const resetAt = now + windowMs;

		if (isNew) {
			logger.debug({ key, maxRequests }, "New rate limit window started");
		}

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
		windowMs: toolsConfig.rateLimit.windowMs * 60,
		keyPrefix: "tools:list-health",
	},
	catchall: {
		maxRequests: toolsConfig.rateLimit.catchallMax,
		windowMs: toolsConfig.rateLimit.windowMs,
		keyPrefix: "tools:catchall",
	},
} as const;

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

export const blockRateLimited = new Elysia({
	name: "block-rate-limited",
}).onBeforeHandle((context) => {
	const ctx = context as { rateLimitExceeded?: boolean; error?: unknown };
	if (ctx.rateLimitExceeded) {
		return ctx.error;
	}
});
