"use client";

import {
	getStateBadge,
	getStateColor,
} from "@fe/dashboard/utils/verification-state";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { VerificationResult } from "../types";
import { AttributesSection } from "./attributes-section";
import { GeneralSection } from "./general-section";
import { JsonViewer } from "./json-viewer";
import { MailServerSection } from "./mail-server-section";
import { ScoreVisualization } from "./score-visualization";

interface VerificationResultCardProps {
	result: VerificationResult;
}

export const VerificationResultCard = ({
	result,
}: VerificationResultCardProps) => {
	const [viewMode, setViewMode] = useState<"details" | "json">("details");
	const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
	const [mounted, setMounted] = useState(false);
	const detailsButtonRef = useRef<HTMLButtonElement>(null);
	const jsonButtonRef = useRef<HTMLButtonElement>(null);

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
		<AnimatePresence mode="wait">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				className="border-stroke-soft-200/50 border-b"
			>
				<div className="px-52 2xl:px-[350px]">
					<div className="border-stroke-soft-200/50 border-r border-l px-7 py-8">
						<div className="mx-auto max-w-3xl">
							<h3 className="mb-4 font-semibold text-lg text-text-strong-950">
								Verification Result
							</h3>

							{/* Main Result Card */}
							<div className="overflow-hidden rounded-xl border border-stroke-soft-200/50 bg-bg-white-0">
								{/* Header with email and score */}
								<div className="flex items-center justify-between border-stroke-soft-200/50 border-b p-4">
									<div className="flex items-center gap-3">
										<div
											className={cn(
												"flex h-10 w-10 items-center justify-center rounded-lg",
												result.state === "deliverable"
													? "bg-success-alpha-10"
													: result.state === "risky"
														? "bg-warning-alpha-10"
														: "bg-error-alpha-10",
											)}
										>
											<Icon
												name={
													result.state === "deliverable"
														? "check-circle"
														: result.state === "risky"
															? "alert-triangle"
															: "x-circle"
												}
												className={cn(
													"h-5 w-5",
													result.state === "deliverable"
														? "text-success-base"
														: result.state === "risky"
															? "text-warning-base"
															: "text-error-base",
												)}
											/>
										</div>
										<div>
											<p className="font-medium font-mono text-text-strong-950">
												{result.email}
											</p>
											<div className="mt-0.5 flex items-center gap-2">
												<span
													className={cn(
														"rounded-full px-2 py-0.5 font-medium text-xs",
														getStateBadge(result.state),
													)}
												>
													{result.state.charAt(0).toUpperCase() +
														result.state.slice(1)}
												</span>
												<span className="text-text-soft-400 text-xs">
													{result.reason.replace(/_/g, " ")}
												</span>
											</div>
										</div>
									</div>
									<div className="text-right">
										<p
											className={cn(
												"font-bold text-3xl",
												getStateColor(result.state),
											)}
										>
											{result.score}
										</p>
										<p className="text-text-soft-400 text-xs">Quality Score</p>
									</div>
								</div>

								{/* Score Visualization */}
								<ScoreVisualization score={result.score} />

								{/* Tab Navigation */}
								<div className="border-stroke-soft-200/50 border-t border-b">
									<div className="relative flex w-fit gap-2 bg-bg-white-0 px-4 py-3">
										{/* Animated floating background */}
										<div
											className={`absolute inset-y-3 rounded-full border border-stroke-soft-200/50 bg-bg-white-100 transition-all duration-300 ${
												mounted ? "opacity-100" : "opacity-0"
											}`}
											style={{
												left: `${indicatorStyle.left}px`,
												width: `${indicatorStyle.width}px`,
												transitionTimingFunction:
													"cubic-bezier(0.65, 0, 0.35, 1)",
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

								{/* Conditional Rendering Based on View Mode */}
								{viewMode === "details" ? (
									<div className="grid grid-cols-2 border-stroke-soft-200/50">
										{/* Left Column: General and Mail Server */}
										<div className="border-stroke-soft-200/50 border-r">
											<GeneralSection
												state={result.state}
												reason={result.reason}
												domain={result.domain}
												didYouMean={result.analytics.didYouMean || undefined}
											/>
											<MailServerSection
												smtpProvider={result.analytics.smtpProvider}
												mxRecord={result.checks.dns.preferredMx || null}
											/>
										</div>

										{/* Right Column: Attributes */}
										<div>
											<AttributesSection
												isFree={result.checks.freeProvider.isFree}
												isRole={result.checks.role.isRole}
												isDisposable={result.checks.disposable.isDisposable}
												isCatchAll={result.checks.smtp.isCatchAll}
												tag={result.tag}
											/>
										</div>
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
				</div>
			</motion.div>
		</AnimatePresence>
	);
};
