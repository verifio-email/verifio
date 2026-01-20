"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useRef,
	useState,
} from "react";

/**
 * Email validation regex (RFC 5322 simplified)
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

/**
 * Validate email format before API call
 */
function isValidEmail(email: string): { valid: boolean; error?: string } {
	if (!email || email.trim().length === 0) {
		return { valid: false, error: "Email is required" };
	}
	if (email.length > MAX_EMAIL_LENGTH) {
		return { valid: false, error: "Email is too long (max 254 characters)" };
	}
	if (!EMAIL_REGEX.test(email)) {
		return { valid: false, error: "Please enter a valid email address" };
	}
	return { valid: true };
}

/**
 * Sanitize error messages to prevent XSS and limit length
 */
function sanitizeError(error: unknown): string {
	if (typeof error !== "string") {
		return "Verification failed";
	}
	// Strip any HTML tags and limit length
	const sanitized = error.replace(/<[^>]*>/g, "").slice(0, 200);
	return sanitized || "Verification failed";
}

/**
 * Verification result type from API
 */
export interface VerificationResult {
	id?: string;
	email: string;
	state: "deliverable" | "undeliverable" | "risky" | "unknown";
	score: number;
	reason: string;
	result: {
		tag: string | null;
		user: string;
		email: string;
		score: number;
		state: string;
		checks: {
			dns: {
				hasMx: boolean;
				valid: boolean;
				mxRecords: string[];
				preferredMx: string;
				domainExists: boolean;
			};
			role: {
				isRole: boolean;
			};
			smtp: {
				valid: boolean | null;
				isCatchAll: boolean | null;
				mailboxExists: boolean | null;
			};
			typo: {
				hasTypo: boolean;
				suggestion: string | null;
				originalDomain: string;
				suggestedDomain: string | null;
			};
			syntax: {
				valid: boolean;
			};
			disposable: {
				isDisposable: boolean;
			};
			freeProvider: {
				isFree: boolean;
			};
		};
		domain: string;
		reason: string;
		duration: number;
		analytics: {
			warnings: string[];
			domainAge: number | null;
			riskLevel: "low" | "medium" | "high";
			didYouMean: string | null;
			smtpProvider: string | null;
			qualityIndicators: string[];
		};
		verifiedAt: string;
	};
	createdAt?: string;
}

interface VerificationContextType {
	/** Current verification result */
	result: VerificationResult | null;
	/** Loading state */
	isLoading: boolean;
	/** Error message if any */
	error: string | null;
	/** Rate limit info */
	rateLimitInfo: {
		remaining: number;
		resetAt: number;
		exceeded: boolean;
	} | null;
	/** Verify a single email */
	verifyEmail: (email: string) => Promise<void>;
	/** Clear current result */
	clearResult: () => void;
}

const VerificationContext = createContext<VerificationContextType | null>(null);

/** Debounce delay in milliseconds */
const DEBOUNCE_MS = 500;

export function VerificationProvider({ children }: { children: ReactNode }) {
	const [result, setResult] = useState<VerificationResult | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [rateLimitInfo, setRateLimitInfo] =
		useState<VerificationContextType["rateLimitInfo"]>(null);

	// Debounce ref to prevent rapid submissions
	const lastSubmitTime = useRef<number>(0);

	const verifyEmail = useCallback(async (email: string) => {
		// Issue #6: Client-side validation before API call
		const validation = isValidEmail(email);
		if (!validation.valid) {
			setError(validation.error || "Invalid email");
			return;
		}

		// Issue #8: Debounce - prevent rapid submissions
		const now = Date.now();
		if (now - lastSubmitTime.current < DEBOUNCE_MS) {
			return; // Ignore rapid submissions
		}
		lastSubmitTime.current = now;

		setIsLoading(true);
		setError(null);
		setResult(null);

		try {
			const response = await fetch("/api/verify/v1/email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			// Extract rate limit headers
			const remaining = Number.parseInt(
				response.headers.get("X-RateLimit-Remaining") || "0",
				10,
			);
			const resetAt =
				Number.parseInt(response.headers.get("X-RateLimit-Reset") || "0", 10) *
				1000;

			if (response.status === 429) {
				const retryAfter = Number.parseInt(
					response.headers.get("Retry-After") || "60",
					10,
				);
				setRateLimitInfo({
					remaining: 0,
					resetAt: Date.now() + retryAfter * 1000,
					exceeded: true,
				});
				setError(
					`Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
				);
				return;
			}

			setRateLimitInfo({
				remaining,
				resetAt,
				exceeded: false,
			});

			const data = await response.json();

			if (!data.success) {
				// Issue #7: Sanitize error to prevent XSS
				setError(sanitizeError(data.error));
				return;
			}

			// Transform API response to match expected format
			setResult({
				email: data.data.email,
				state: data.data.state,
				score: data.data.score,
				reason: data.data.reason,
				result: data.data,
				createdAt: new Date().toISOString(),
			});
		} catch (err) {
			// Issue #7: Sanitize error to prevent XSS
			setError(
				sanitizeError(
					err instanceof Error ? err.message : "Failed to verify email",
				),
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const clearResult = useCallback(() => {
		setResult(null);
		setError(null);
	}, []);

	return (
		<VerificationContext.Provider
			value={{
				result,
				isLoading,
				error,
				rateLimitInfo,
				verifyEmail,
				clearResult,
			}}
		>
			{children}
		</VerificationContext.Provider>
	);
}

export function useVerification() {
	const context = useContext(VerificationContext);
	if (!context) {
		throw new Error(
			"useVerification must be used within a VerificationProvider",
		);
	}
	return context;
}
