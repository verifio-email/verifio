"use client";

import { AnimatedBackButton } from "@fe/dashboard/components/animated-back-button";
import { DomainFavicon } from "@fe/dashboard/components/domain-favicon";
import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import {
	getStateColor,
	getStateIcon,
} from "@fe/dashboard/utils/verification-state";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import { Skeleton } from "@verifio/ui/skeleton";
import { useEffect, useRef, useState } from "react";
import { AttributesSection } from "../../../components/attributes-section";
import { GeneralSection } from "../../../components/general-section";
import { JsonViewer } from "../../../components/json-viewer";
import { MailServerSection } from "../../../components/mail-server-section";
import { ScoreVisualization } from "../../../components/score-visualization";

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
	const [viewMode, setViewMode] = useState<"details" | "json">("details");
	const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
	const [mounted, setMounted] = useState(false);
	const detailsButtonRef = useRef<HTMLButtonElement>(null);
	const jsonButtonRef = useRef<HTMLButtonElement>(null);

	const checks = result?.result?.checks;
	const analytics = result?.result?.analytics;

	// Calculate character counts from email user
	const emailUser = result?.result?.user || "";
	const numericalChars = (emailUser.match(/[0-9]/g) || []).length;
	const alphabeticalChars = (emailUser.match(/[a-zA-Z]/g) || []).length;
	const unicodeSymbols = (emailUser.match(/[^\w]/g) || []).length;

	// Initial measurement on mount
	useEffect(() => {
		const activeButton = detailsButtonRef.current;
		if (activeButton) {
			const { offsetWidth: width, offsetLeft: left } = activeButton;
			setIndicatorStyle({ width, left });
			setMounted(true);
		}
	}, []);

	// Update on viewMode change
	useEffect(() => {
		const activeButton =
			viewMode === "details" ? detailsButtonRef.current : jsonButtonRef.current;
		if (activeButton) {
			const { offsetWidth: width, offsetLeft: left } = activeButton;
			setIndicatorStyle({ width, left });
		}
	}, [viewMode]);

	return (
		<div className="h-full overflow-y-auto">
			{/* Back Button Section */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className="px-52 2xl:px-[340px]">
					<div className="border-stroke-soft-200/50 border-r border-l px-5 py-4">
						<AnimatedBackButton onClick={() => push("/playground")} />
					</div>
				</div>
			</div>

			{/* Header Section */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className="px-52 2xl:px-[340px]">
					<div className="flex items-center justify-between border-stroke-soft-200/50 border-r border-l px-5 py-6">
						<div>
							{isLoading ? (
								<>
									<Skeleton className="mb-2 h-4 w-32 rounded-full" />
									<Skeleton className="h-7 w-64 rounded-lg" />
								</>
							) : (
								<div className="flex items-center gap-3">
									{result?.result?.domain && (
										<DomainFavicon
											domain={result.result.domain ?? ""}
											size={22}
										/>
									)}
									<h1 className="font-medium font-mono text-2xl text-text-strong-950">
										{result?.email || "---"}
									</h1>
								</div>
							)}
						</div>

						{/* Score Badge */}
						<div>
							{isLoading ? (
								<Skeleton className="h-14 w-14 rounded-xl" />
							) : (
								<div className="flex items-center gap-3">
									<div
										className={`flex items-center gap-1 ${getStateColor(result?.state || "unknown")}`}
									>
										<Icon
											name={getStateIcon(result?.state || "unknown")}
											className="h-4 w-4"
										/>
										<p className="font-medium text-paragraph-sm capitalize">
											{result?.state || "Unknown"}
										</p>
									</div>
									<div
										className={cn(
											"font-bold text-[22px]",
											getScoreColor(result?.score || 0),
										)}
									>
										{result?.score || 0}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Score Visualization */}
			{!isLoading && result && (
				<div className="border-stroke-soft-200/50 border-b">
					<div className="px-52 2xl:px-[340px]">
						<div className="border-stroke-soft-200/50 border-r border-l">
							<ScoreVisualization score={result?.score || 0} />
						</div>
					</div>
				</div>
			)}

			{/* Tab Navigation */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className="px-52 2xl:px-[340px]">
					<div className="border-stroke-soft-200/50 border-r border-l px-5">
						<div className="relative flex w-fit gap-2 bg-bg-white-0 py-3">
							{/* Animated floating background */}
							<div
								className={`absolute inset-y-3 rounded-full border border-stroke-soft-200/50 bg-bg-white-100 transition-all duration-300 ${
									mounted ? "opacity-100" : "opacity-0"
								}`}
								style={{
									left: `${indicatorStyle.left}px`,
									width: `${indicatorStyle.width}px`,
									transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
								}}
								aria-hidden="true"
							/>
							<button
								ref={detailsButtonRef}
								type="button"
								onClick={() => setViewMode("details")}
								className="relative z-10 flex items-center gap-2 rounded-full border border-transparent px-4 py-1.5 transition-colors hover:opacity-70"
							>
								<Icon name="file-text" className="h-3.5 w-3.5" />
								Details
							</button>
							<button
								ref={jsonButtonRef}
								type="button"
								onClick={() => setViewMode("json")}
								className="relative z-10 flex items-center gap-2 rounded-full border border-transparent px-4 py-1.5 transition-colors hover:opacity-70"
							>
								<Icon name="json" className="h-3.5 w-3.5" />
								JSON
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Content Section */}
			{viewMode === "details" ? (
				<div className="border-stroke-soft-200/50 border-b">
					<div className="px-52 2xl:px-[340px]">
						<div className="grid grid-cols-2 border-stroke-soft-200/50 border-r border-l">
							{/* Left Column: General and Mail Server */}
							<div className="border-stroke-soft-200/50 border-r">
								{isLoading ? (
									<div className="space-y-3 p-5">
										<Skeleton className="h-5 w-20" />
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-full" />
									</div>
								) : (
									<>
										<GeneralSection
											state={result?.state || "unknown"}
											reason={result?.reason || ""}
											domain={result?.result?.domain || ""}
											user={result?.result?.user}
											tag={result?.result?.tag}
											didYouMean={analytics?.didYouMean || undefined}
											riskLevel={analytics?.riskLevel}
										/>
										<MailServerSection
											smtpProvider={analytics?.smtpProvider || null}
											mxRecord={checks?.dns?.preferredMx || null}
										/>
									</>
								)}
							</div>

							{/* Right Column: Attributes */}
							<div>
								{isLoading ? (
									<div className="space-y-3 p-5">
										<Skeleton className="h-5 w-20" />
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-full" />
									</div>
								) : (
									<AttributesSection
										isFree={checks?.freeProvider?.isFree || false}
										freeProvider={checks?.freeProvider?.provider}
										isRole={checks?.role?.isRole || false}
										roleName={checks?.role?.role}
										isDisposable={checks?.disposable?.isDisposable || false}
										disposableProvider={checks?.disposable?.provider}
										isCatchAll={checks?.smtp?.isCatchAll ?? null}
										syntaxValid={checks?.syntax?.valid}
										dnsValid={checks?.dns?.valid}
										hasMx={checks?.dns?.hasMx}
										numericalChars={numericalChars}
										alphabeticalChars={alphabeticalChars}
										unicodeSymbols={unicodeSymbols}
										verificationTime={result?.result?.duration}
										verifiedAt={result?.result?.verifiedAt}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="border-stroke-soft-200/50 border-b">
					<div className="px-52 2xl:px-[340px]">
						<div className="border-stroke-soft-200/50 border-r border-l">
							{isLoading ? (
								<div className="p-5">
									<Skeleton className="h-64 w-full" />
								</div>
							) : (
								<JsonViewer
									data={{ success: true, data: result }}
									filename="response.json"
								/>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
