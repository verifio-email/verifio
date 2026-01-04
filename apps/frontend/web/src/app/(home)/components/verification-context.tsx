"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useState,
} from "react";

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

export function VerificationProvider({ children }: { children: ReactNode }) {
	const [result, setResult] = useState<VerificationResult | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [rateLimitInfo, setRateLimitInfo] =
		useState<VerificationContextType["rateLimitInfo"]>(null);

	const verifyEmail = useCallback(async (email: string) => {
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
				setError(data.error || "Verification failed");
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
			setError(err instanceof Error ? err.message : "Failed to verify email");
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
