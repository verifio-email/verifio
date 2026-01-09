"use client";

import {
	getStateColor,
	getStateIcon,
} from "@fe/dashboard/utils/verification-state";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import { AnimatePresence, motion } from "framer-motion";

// Full verification result with nested result data from API
export interface EmailVerificationData {
	email: string;
	state: "deliverable" | "undeliverable" | "risky" | "unknown";
	score: number;
	reason: string;
	// The API returns full verification data nested in a 'result' field
	result?: {
		user?: string;
		domain?: string;
		tag?: string | null;
		checks?: {
			syntax: { valid: boolean; error?: string };
			dns: {
				valid: boolean;
				domainExists: boolean;
				hasMx: boolean;
				mxRecords: string[];
				preferredMx?: string;
			};
			disposable: { isDisposable: boolean; provider?: string };
			role: { isRole: boolean; role?: string };
			freeProvider: { isFree: boolean; provider?: string };
			typo: { hasTypo: boolean; suggestion?: string };
			smtp: { valid: boolean | null; isCatchAll: boolean | null };
		};
		analytics?: {
			didYouMean: string | null;
			smtpProvider: string | null;
			riskLevel: "low" | "medium" | "high";
			qualityIndicators: string[];
			warnings: string[];
		};
		duration?: number;
	};
}

interface EmailDetailModalProps {
	email: EmailVerificationData | null;
	onClose: () => void;
}

// Helper functions for styling
const getScoreColor = (score: number) => {
	if (score >= 80) return "text-success-base";
	if (score >= 60) return "text-warning-base";
	return "text-error-base";
};

export const EmailDetailModal = ({ email, onClose }: EmailDetailModalProps) => {
	if (!email) return null;

	// Extract nested data from result field
	const checks = email.result?.checks;
	const analytics = email.result?.analytics;
	const duration = email.result?.duration;
	const domain = email.result?.domain || email.email.split("@")[1];
	const user = email.result?.user || email.email.split("@")[0];
	const tag = email.result?.tag;

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
				onClick={onClose}
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.95, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95, y: 20 }}
					onClick={(e) => e.stopPropagation()}
					className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl border border-stroke-soft-200/50 bg-bg-white-0 shadow-xl"
				>
					{/* Scrollable content */}
					<div className="max-h-[90vh] overflow-y-auto">
						{/* Header with close button */}
						<div className="relative border-stroke-soft-200/50 border-b px-6 py-3">
							<button
								type="button"
								onClick={onClose}
								className="-translate-y-1/2 absolute top-1/2 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-text-sub-600 transition-all hover:bg-bg-weak-50 hover:text-text-strong-950"
							>
								<Icon name="cross" className="h-4 w-4" />
							</button>
							<span className="font-medium text-sm text-text-strong-950">
								Email Details
							</span>
						</div>

						{/* Email Info Section */}
						<div className="relative border-stroke-soft-200/50 border-b px-6 py-4">
							<div className="flex items-start justify-between">
								<div>
									<div className="mb-1 flex items-center gap-2">
										<span className="font-mono font-semibold text-base text-text-strong-950">
											{email.email}
										</span>
									</div>
								</div>
								<p
									className={cn(
										"font-bold text-xl tabular-nums",
										getScoreColor(email.score),
									)}
								>
									{email.score}
								</p>
							</div>
						</div>

						{/* General Section */}
						<div className="relative border-stroke-soft-200/50 border-b px-6 py-4">
							<h3 className="mb-3 font-semibold text-sm text-text-strong-950">
								General
							</h3>
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-text-sub-600 text-xs">State</span>
									<div className="flex items-center gap-1.5">
										<Icon
											name={getStateIcon(email.state)}
											className={cn("h-3 w-3", getStateColor(email.state))}
										/>
										<span
											className={cn(
												"font-medium text-xs capitalize",
												getStateColor(email.state),
											)}
										>
											{email.state}
										</span>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-text-sub-600 text-xs">Reason</span>
									<span className="rounded border border-stroke-soft-200 bg-bg-weak-50 px-2 py-0.5 font-mono text-text-strong-950 text-xs">
										{email.reason?.replace(/_/g, "_") || "—"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-text-sub-600 text-xs">Domain</span>
									<span className="font-mono text-primary-base text-xs">
										{domain || "—"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-text-sub-600 text-xs">User</span>
									<span className="text-text-strong-950 text-xs">
										{user || "—"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-text-sub-600 text-xs">Tag</span>
									<span className="text-text-strong-950 text-xs">
										{tag || "—"}
									</span>
								</div>
							</div>
						</div>

						{/* Attributes Section */}
						<div className="relative border-stroke-soft-200/50 border-b px-6 py-4">
							<h3 className="mb-3 font-semibold text-text-strong-950 text-xs">
								Attributes
							</h3>
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2.5">
										<Icon
											name="dollar"
											className="h-3 w-3 text-text-soft-400"
										/>
										<span className="text-text-sub-600 text-xs">Free</span>
									</div>
									<span className="text-text-strong-950 text-xs">
										{checks?.freeProvider?.isFree ? "Yes" : "No"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2.5">
										<Icon name="user" className="h-3 w-3 text-text-soft-400" />
										<span className="text-text-sub-600 text-xs">Role</span>
									</div>
									<span className="text-text-strong-950 text-xs">
										{checks?.role?.isRole ? "Yes" : "No"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2.5">
										<Icon name="trash" className="h-3 w-3 text-text-soft-400" />
										<span className="text-text-sub-600 text-xs">
											Disposable
										</span>
									</div>
									<span className="text-text-strong-950 text-xs">
										{checks?.disposable?.isDisposable ? "Yes" : "No"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2.5">
										<Icon
											name="check-circle"
											className="h-3 w-3 text-text-soft-400"
										/>
										<span className="text-text-sub-600 text-xs">
											Accept-All
										</span>
									</div>
									<span className="text-text-strong-950 text-xs">
										{checks?.smtp?.isCatchAll ? "Yes" : "No"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2.5">
										<Icon name="check" className="h-3 w-3 text-text-soft-400" />
										<span className="text-text-sub-600 text-xs">
											Syntax Valid
										</span>
									</div>
									<span
										className={cn(
											"text-xs",
											checks?.syntax?.valid
												? "text-success-base"
												: "text-text-strong-950",
										)}
									>
										{checks?.syntax?.valid ? "Yes" : "No"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2.5">
										<Icon name="globe" className="h-3 w-3 text-text-soft-400" />
										<span className="text-text-sub-600 text-xs">DNS Valid</span>
									</div>
									<span
										className={cn(
											"text-xs",
											checks?.dns?.domainExists
												? "text-success-base"
												: "text-text-strong-950",
										)}
									>
										{checks?.dns?.domainExists ? "Yes" : "No"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2.5">
										<Icon
											name="server"
											className="h-3 w-3 text-text-soft-400"
										/>
										<span className="text-text-sub-600 text-xs">Has MX</span>
									</div>
									<span className="text-text-strong-950 text-xs">
										{checks?.dns?.hasMx ? "Yes" : "No"}
									</span>
								</div>
							</div>
						</div>

						{/* Mail Server Section */}
						<div className="relative px-6 py-4">
							<h3 className="mb-3 font-semibold text-text-strong-950 text-xs">
								Mail Server
							</h3>
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-text-sub-600 text-xs">
										SMTP Provider
									</span>
									<span className="text-text-strong-950 text-xs">
										{analytics?.smtpProvider || "—"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-text-sub-600 text-xs">MX Record</span>
									<span className="text-text-strong-950 text-xs">
										{checks?.dns?.preferredMx ||
											checks?.dns?.mxRecords?.[0] ||
											"—"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-text-sub-600 text-xs">Risk Level</span>
									<span
										className={cn(
											"font-medium text-xs",
											analytics?.riskLevel === "low"
												? "text-success-base"
												: analytics?.riskLevel === "medium"
													? "text-warning-base"
													: analytics?.riskLevel
														? "text-error-base"
														: "text-text-strong-950",
										)}
									>
										{analytics?.riskLevel
											? analytics.riskLevel.charAt(0).toUpperCase() +
												analytics.riskLevel.slice(1)
											: "—"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-text-sub-600 text-xs">
										Verification Time
									</span>
									<span className="text-text-strong-950 text-xs">
										{duration !== undefined ? `${duration}ms` : "—"}
									</span>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};

export default EmailDetailModal;
