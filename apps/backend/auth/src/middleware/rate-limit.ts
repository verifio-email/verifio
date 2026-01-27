import { logger } from "@verifio/logger";
import { createHash } from "crypto";
import { Elysia } from "elysia";

interface RateLimitEntry {
	count: number;
	windowStart: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

setInterval(
	() => {
		const now = Date.now();
		for (const [key, entry] of rateLimitStore.entries()) {
			if (now - entry.windowStart > 2 * 60 * 60 * 1000) {
				rateLimitStore.delete(key);
			}
		}
	},
	5 * 60 * 1000,
);

function getClientIP(headers: Record<string, string | undefined>): string {
	const forwardedFor = headers["x-forwarded-for"];
	if (forwardedFor) {
		const firstIP = forwardedFor.split(",")[0];
		if (firstIP) return firstIP.trim();
	}
	return headers["x-real-ip"] || headers["cf-connecting-ip"] || "127.0.0.1";
}

function getDeviceFingerprint(
	headers: Record<string, string | undefined>,
): string {
	const components = [
		headers["user-agent"] || "",
		headers["accept-language"] || "",
		headers["accept-encoding"] || "",
		headers["sec-ch-ua"] || "",
		headers["sec-ch-ua-platform"] || "",
		headers["sec-ch-ua-mobile"] || "",
	];

	const fingerprintString = components.join("|");
	return createHash("sha256")
		.update(fingerprintString)
		.digest("hex")
		.substring(0, 16);
}

function checkRateLimit(
	key: string,
	maxRequests: number,
	windowMs: number,
): { allowed: boolean; remaining: number; resetAt: number } {
	const now = Date.now();
	const entry = rateLimitStore.get(key);

	if (!entry || now - entry.windowStart > windowMs) {
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

export const RATE_LIMITS = {
	ip: { maxRequests: 10, windowMs: 60 * 1000 },
	email: { maxRequests: 5, windowMs: 15 * 60 * 1000 },
	fingerprint: { maxRequests: 15, windowMs: 60 * 1000 },
	signup: { maxRequests: 3, windowMs: 60 * 1000 },
	passwordReset: { maxRequests: 3, windowMs: 5 * 60 * 1000 },
} as const;

function extractEmailFromBody(body: unknown): string | null {
	if (body && typeof body === "object" && "email" in body) {
		const email = (body as { email: unknown }).email;
		if (typeof email === "string") return email.toLowerCase();
	}
	return null;
}

export const authRateLimiter = new Elysia({ name: "auth-rate-limiter" })
	.derive({ as: "scoped" }, async ({ headers, path, set, request }) => {
		const ip = getClientIP(headers);
		const fingerprint = getDeviceFingerprint(headers);

		let email: string | null = null;
		if (
			request.method === "POST" &&
			(path.includes("sign-in") || path.includes("sign-up"))
		) {
			try {
				const clonedRequest = request.clone();
				const body = await clonedRequest.json();
				email = extractEmailFromBody(body);
			} catch {
				// Body parsing failed, continue without email
			}
		}

		const results: {
			key: string;
			allowed: boolean;
			remaining: number;
			resetAt: number;
		}[] = [];

		// 1. IP-based rate limit
		const ipKey = `ip:${ip}`;
		const ipResult = checkRateLimit(
			ipKey,
			RATE_LIMITS.ip.maxRequests,
			RATE_LIMITS.ip.windowMs,
		);
		results.push({ key: "ip", ...ipResult });

		// 2. Fingerprint-based rate limit
		const fpKey = `fp:${fingerprint}`;
		const fpResult = checkRateLimit(
			fpKey,
			RATE_LIMITS.fingerprint.maxRequests,
			RATE_LIMITS.fingerprint.windowMs,
		);
		results.push({ key: "fingerprint", ...fpResult });

		// 3. Email-based rate limit (if email available)
		if (email) {
			const emailKey = `email:${email}`;
			const emailResult = checkRateLimit(
				emailKey,
				RATE_LIMITS.email.maxRequests,
				RATE_LIMITS.email.windowMs,
			);
			results.push({ key: "email", ...emailResult });
		}

		// 4. Path-specific limits
		if (path.includes("sign-up")) {
			const signupKey = `signup:${ip}:${fingerprint}`;
			const signupResult = checkRateLimit(
				signupKey,
				RATE_LIMITS.signup.maxRequests,
				RATE_LIMITS.signup.windowMs,
			);
			results.push({ key: "signup", ...signupResult });
		} else if (
			path.includes("reset-password") ||
			path.includes("forgot-password")
		) {
			const resetKey = `reset:${ip}`;
			const resetResult = checkRateLimit(
				resetKey,
				RATE_LIMITS.passwordReset.maxRequests,
				RATE_LIMITS.passwordReset.windowMs,
			);
			results.push({ key: "reset", ...resetResult });
		}

		// Find the most restrictive limit
		const blockedResult = results.find((r) => !r.allowed);
		const minRemaining = Math.min(...results.map((r) => r.remaining));

		set.headers["X-RateLimit-Remaining"] = String(minRemaining);

		if (blockedResult) {
			const retryAfter = Math.ceil((blockedResult.resetAt - Date.now()) / 1000);
			set.headers["Retry-After"] = String(retryAfter);
			logger.warn(
				{ ip, fingerprint, email, blockedBy: blockedResult.key, retryAfter },
				"Auth rate limit exceeded",
			);
			return {
				rateLimitExceeded: true,
				retryAfter,
				blockedBy: blockedResult.key,
				email,
			};
		}

		return { rateLimitExceeded: false, retryAfter: 0, blockedBy: null, email };
	})
	.onBeforeHandle(({ rateLimitExceeded, retryAfter, blockedBy, set }) => {
		if (rateLimitExceeded) {
			set.status = 429;
			const message =
				blockedBy === "email"
					? "Too many login attempts for this account. Please try again later."
					: "Too many attempts. Please try again later.";
			return { success: false, error: message, retryAfter };
		}
	});
