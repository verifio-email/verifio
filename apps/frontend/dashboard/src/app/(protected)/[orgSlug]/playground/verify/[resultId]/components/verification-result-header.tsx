"use client";

import { AnimatedBackButton } from "@fe/dashboard/components/animated-back-button";
import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import { Skeleton } from "@verifio/ui/skeleton";

interface VerificationResultData {
	id: string;
	email: string;
	state: string;
	score: number;
	reason: string;
	result: {
		email: string;
		user: string;
		domain: string;
		tag: string | null;
		state: "deliverable" | "undeliverable" | "risky" | "unknown";
		reason: string;
		score: number;
		checks: {
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
		analytics: {
			didYouMean: string | null;
			smtpProvider: string | null;
			riskLevel: "low" | "medium" | "high";
			qualityIndicators: string[];
			warnings: string[];
		};
		duration: number;
		verifiedAt: string;
	} | null;
	createdAt: string;
}

interface VerificationResultHeaderProps {
	result: VerificationResultData | undefined;
	isLoading: boolean;
	isFailed?: boolean;
}

const getStateColor = (state: string) => {
	switch (state) {
		case "deliverable":
			return "text-success-base";
		case "risky":
			return "text-warning-base";
		case "undeliverable":
			return "text-error-base";
		default:
			return "text-text-sub-600";
	}
};

const getStateIcon = (state: string) => {
	switch (state) {
		case "deliverable":
			return "check-circle";
		case "risky":
			return "alert-triangle";
		case "undeliverable":
			return "x-circle";
		default:
			return "help-circle";
	}
};

const getScoreColor = (score: number) => {
	if (score >= 80) return "text-success-base bg-success-alpha-10";
	if (score >= 50) return "text-warning-base bg-warning-alpha-10";
	return "text-error-base bg-error-alpha-10";
};

export const VerificationResultHeader = ({
	result,
	isLoading,
}: VerificationResultHeaderProps) => {
	const { push } = useUserOrganization();

	const checks = result?.result?.checks;
	const analytics = result?.result?.analytics;

	return (
		<div className="h-full overflow-y-auto">
			{/* Back Button Section */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className="px-[340px] 2xl:px-[450px]">
					<div className="border-stroke-soft-200/50 border-r border-l px-5 py-4">
						<AnimatedBackButton onClick={() => push("/playground")} />
					</div>
				</div>
			</div>

			{/* Header Section */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className="px-[340px] 2xl:px-[450px]">
					<div className="flex items-center justify-between border-stroke-soft-200/50 border-r border-l px-5 py-6">
						<div>
							{isLoading ? (
								<>
									<Skeleton className="mb-2 h-4 w-32 rounded-full" />
									<Skeleton className="h-7 w-64 rounded-lg" />
								</>
							) : (
								<>
									<div className="mb-1 flex items-center gap-1.5">
										<p className="font-medium text-paragraph-xs text-text-sub-600">
											Email Verification
										</p>
										<p className="font-semibold text-paragraph-xs text-text-sub-600">
											•
										</p>
										<div
											className={`flex items-center gap-1 ${getStateColor(result?.state || "unknown")}`}
										>
											<Icon
												name={getStateIcon(result?.state || "unknown")}
												className="h-3.5 w-3.5"
											/>
											<p className="font-medium text-paragraph-xs capitalize">
												{result?.state || "Unknown"}
											</p>
										</div>
									</div>
									<h1 className="font-medium font-mono text-2xl text-text-strong-950">
										{result?.email || "---"}
									</h1>
								</>
							)}
						</div>

						{/* Score Badge */}
						<div>
							{isLoading ? (
								<Skeleton className="h-14 w-14 rounded-xl" />
							) : (
								<div
									className={cn(
										"flex h-14 w-14 items-center justify-center rounded-xl font-bold text-2xl",
										getScoreColor(result?.score || 0),
									)}
								>
									{result?.score || 0}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* General Section */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className="px-[340px] 2xl:px-[450px]">
					<div className="border-stroke-soft-200/50 border-r border-l px-5 py-5">
						<h3 className="mb-4 font-semibold text-lg text-text-strong-950">
							General
						</h3>

						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm text-text-sub-600">State</span>
								{isLoading ? (
									<Skeleton className="h-5 w-24" />
								) : (
									<div
										className={`flex items-center gap-1.5 ${getStateColor(result?.state || "unknown")}`}
									>
										<Icon
											name={getStateIcon(result?.state || "unknown")}
											className="h-4 w-4"
										/>
										<span className="font-medium text-sm capitalize">
											{result?.state || "Unknown"}
										</span>
									</div>
								)}
							</div>

							<div className="flex items-center justify-between">
								<span className="text-sm text-text-sub-600">Reason</span>
								{isLoading ? (
									<Skeleton className="h-5 w-32" />
								) : (
									<span className="rounded bg-bg-weak-50 px-2 py-0.5 font-mono text-sm text-text-strong-950 uppercase">
										{result?.reason || "---"}
									</span>
								)}
							</div>

							<div className="flex items-center justify-between">
								<span className="text-sm text-text-sub-600">Domain</span>
								{isLoading ? (
									<Skeleton className="h-5 w-24" />
								) : (
									<span className="font-medium text-primary-base text-sm">
										{result?.result?.domain || "---"}
									</span>
								)}
							</div>

							<div className="flex items-center justify-between">
								<span className="text-sm text-text-sub-600">User</span>
								{isLoading ? (
									<Skeleton className="h-5 w-24" />
								) : (
									<span className="font-medium text-sm text-text-strong-950">
										{result?.result?.user || "---"}
									</span>
								)}
							</div>

							<div className="flex items-center justify-between">
								<span className="text-sm text-text-sub-600">Tag</span>
								{isLoading ? (
									<Skeleton className="h-5 w-16" />
								) : (
									<span className="text-sm text-text-strong-950">
										{result?.result?.tag || "—"}
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Attributes Section */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className="px-[340px] 2xl:px-[450px]">
					<div className="border-stroke-soft-200/50 border-r border-l px-5 py-5">
						<h3 className="mb-4 font-semibold text-lg text-text-strong-950">
							Attributes
						</h3>

						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Icon name="dollar" className="h-4 w-4 text-text-sub-600" />
									<span className="text-sm text-text-sub-600">Free</span>
								</div>
								{isLoading ? (
									<Skeleton className="h-5 w-12" />
								) : (
									<span className="text-sm text-text-strong-950">
										{checks?.freeProvider?.isFree ? "Yes" : "No"}
									</span>
								)}
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Icon name="user" className="h-4 w-4 text-text-sub-600" />
									<span className="text-sm text-text-sub-600">Role</span>
								</div>
								{isLoading ? (
									<Skeleton className="h-5 w-12" />
								) : (
									<span className="text-sm text-text-strong-950">
										{checks?.role?.isRole ? checks.role.role || "Yes" : "No"}
									</span>
								)}
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Icon name="trash" className="h-4 w-4 text-text-sub-600" />
									<span className="text-sm text-text-sub-600">Disposable</span>
								</div>
								{isLoading ? (
									<Skeleton className="h-5 w-12" />
								) : (
									<span className="text-sm text-text-strong-950">
										{checks?.disposable?.isDisposable ? "Yes" : "No"}
									</span>
								)}
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Icon name="mail" className="h-4 w-4 text-text-sub-600" />
									<span className="text-sm text-text-sub-600">Accept-All</span>
								</div>
								{isLoading ? (
									<Skeleton className="h-5 w-12" />
								) : (
									<span className="text-sm text-text-strong-950">
										{checks?.smtp?.isCatchAll ? "Yes" : "No"}
									</span>
								)}
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Icon name="check" className="h-4 w-4 text-text-sub-600" />
									<span className="text-sm text-text-sub-600">
										Syntax Valid
									</span>
								</div>
								{isLoading ? (
									<Skeleton className="h-5 w-12" />
								) : (
									<span className="text-sm text-text-strong-950">
										{checks?.syntax?.valid ? "Yes" : "No"}
									</span>
								)}
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Icon name="globe" className="h-4 w-4 text-text-sub-600" />
									<span className="text-sm text-text-sub-600">DNS Valid</span>
								</div>
								{isLoading ? (
									<Skeleton className="h-5 w-12" />
								) : (
									<span className="text-sm text-text-strong-950">
										{checks?.dns?.valid ? "Yes" : "No"}
									</span>
								)}
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Icon name="server" className="h-4 w-4 text-text-sub-600" />
									<span className="text-sm text-text-sub-600">Has MX</span>
								</div>
								{isLoading ? (
									<Skeleton className="h-5 w-12" />
								) : (
									<span className="text-sm text-text-strong-950">
										{checks?.dns?.hasMx ? "Yes" : "No"}
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Mail Server Section */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className="px-[340px] 2xl:px-[450px]">
					<div className="border-stroke-soft-200/50 border-r border-l px-5 py-5">
						<h3 className="mb-4 font-semibold text-lg text-text-strong-950">
							Mail Server
						</h3>

						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm text-text-sub-600">SMTP Provider</span>
								{isLoading ? (
									<Skeleton className="h-5 w-24" />
								) : (
									<span className="font-medium text-sm text-text-strong-950">
										{analytics?.smtpProvider || "—"}
									</span>
								)}
							</div>

							<div className="flex items-center justify-between">
								<span className="text-sm text-text-sub-600">MX Record</span>
								{isLoading ? (
									<Skeleton className="h-5 w-40" />
								) : (
									<span className="font-mono text-sm text-text-strong-950">
										{checks?.dns?.preferredMx || "—"}
									</span>
								)}
							</div>

							<div className="flex items-center justify-between">
								<span className="text-sm text-text-sub-600">Risk Level</span>
								{isLoading ? (
									<Skeleton className="h-5 w-16" />
								) : (
									<span
										className={cn(
											"rounded px-2 py-0.5 font-medium text-sm capitalize",
											analytics?.riskLevel === "low"
												? "bg-success-alpha-10 text-success-base"
												: analytics?.riskLevel === "medium"
													? "bg-warning-alpha-10 text-warning-base"
													: "bg-error-alpha-10 text-error-base",
										)}
									>
										{analytics?.riskLevel || "—"}
									</span>
								)}
							</div>

							<div className="flex items-center justify-between">
								<span className="text-sm text-text-sub-600">
									Verification Time
								</span>
								{isLoading ? (
									<Skeleton className="h-5 w-16" />
								) : (
									<span className="text-sm text-text-strong-950">
										{result?.result?.duration || 0}ms
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
