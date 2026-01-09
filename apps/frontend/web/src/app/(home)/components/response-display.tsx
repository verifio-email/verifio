"use client";

import { Icon } from "@verifio/ui/icon";
import { useEffect, useRef, useState } from "react";
import { AttributesSection } from "./attributes-section";
import { GeneralSection } from "./general-section";
import { JsonViewer } from "./json-viewer";
import { MailServerSection } from "./mail-server-section";
import { ResponseHeader } from "./response-header";
import { ScoreVisualization } from "./score-visualization";
import { useVerification } from "./verification-context";

export function ResponseDisplay() {
	const { result, isLoading } = useVerification();
	const [viewMode, setViewMode] = useState<"details" | "json">("details");
	const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
	const [mounted, setMounted] = useState(false);
	const detailsButtonRef = useRef<HTMLButtonElement>(null);
	const jsonButtonRef = useRef<HTMLButtonElement>(null);

	// Initial measurement on mount - hooks MUST be called before any conditional returns
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

	// Show empty state when no result and not loading
	if (!result && !isLoading) {
		return (
			<div className="-mt-[51px] mx-auto max-w-7xl">
				<div className="border-stroke-soft-100 border-r border-l">
					<div className="mx-auto max-w-4xl border-stroke-soft-100 border-r border-l pt-24 pb-16">
						<div className="flex flex-col items-center justify-center gap-4 border-stroke-soft-100 border-t px-6 py-16 text-center" />
					</div>
				</div>
			</div>
		);
	}

	// Show loading state when verifying
	if (isLoading && !result) {
		return (
			<div className="-mt-[51px] mx-auto max-w-7xl">
				<div className="border-stroke-soft-100 border-r border-l">
					<div className="mx-auto max-w-4xl border-stroke-soft-100 border-r border-l pt-24 pb-16">
						<div className="flex flex-col items-center justify-center gap-4 border-stroke-soft-100 border-t px-6 py-16 text-center">
							<Icon
								name="loading"
								className="h-12 w-12 animate-spin text-primary-base"
							/>
							<div>
								<h3 className="font-semibold text-lg text-text-strong-950">
									Verifying email...
								</h3>
								<p className="mt-1 text-sm text-text-sub-600">
									Please wait while we check this email address
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// result is guaranteed to exist here due to the early returns above
	const displayData = result!;

	return (
		<div className="-mt-[51px] mx-auto max-w-7xl">
			<div className="border-stroke-soft-100 border-r border-l">
				<div className="mx-auto max-w-4xl border-stroke-soft-100 border-r border-l pt-24">
					<div className="border-stroke-soft-100 border-t">
						{/* Show indicator that this is a live result */}
						<div className="flex items-center gap-2 bg-primary-base/5 px-4 py-2 text-primary-base text-sm">
							<Icon name="check-circle-filled" className="h-4 w-4" />
							<span>Live verification result</span>
						</div>

						<ResponseHeader
							email={displayData.email}
							score={displayData.score}
						/>
						<ScoreVisualization score={displayData.score} />
						<div className="border-stroke-soft-100 border-t border-b">
							<div className="relative flex w-fit gap-2 bg-bg-white-0 px-4 py-3">
								{/* Animated floating background */}
								<div
									className={`absolute inset-y-3 rounded-full border border-stroke-soft-100 bg-bg-white-100 transition-all duration-300 ${
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

						{/* Conditional Rendering Based on View Mode */}
						{viewMode === "details" ? (
							<div className="grid grid-cols-2 border-stroke-soft-100">
								{/* Left Column: General and Mail Server */}
								<div className="border-stroke-soft-100 border-r">
									<GeneralSection
										state={displayData.state}
										reason={displayData.reason}
										domain={displayData.result.domain}
										didYouMean={
											displayData.result.analytics.didYouMean || undefined
										}
									/>
									<MailServerSection
										smtpProvider={displayData.result.analytics.smtpProvider}
										mxRecord={displayData.result.checks.dns.preferredMx}
									/>
								</div>

								{/* Right Column: Attributes */}
								<div>
									<AttributesSection
										isFree={displayData.result.checks.freeProvider.isFree}
										isRole={displayData.result.checks.role.isRole}
										isDisposable={
											displayData.result.checks.disposable.isDisposable
										}
										isCatchAll={displayData.result.checks.smtp.isCatchAll}
										tag={displayData.result.tag}
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
	);
}
