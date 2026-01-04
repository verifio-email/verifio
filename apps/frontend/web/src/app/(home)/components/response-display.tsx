"use client";

import { Icon } from "@verifio/ui/icon";
import React, { useState, useEffect, useRef } from "react";
import { ResponseHeader } from "./response-header";
import { ScoreVisualization } from "./score-visualization";
import { GeneralSection } from "./general-section";
import { MailServerSection } from "./mail-server-section";
import { AttributesSection } from "./attributes-section";
import { JsonViewer } from "./json-viewer";

// Hardcoded response data
const mockResponse = {
	success: true,
	data: {
		id: "vr_vh0ng2gd2cy6swugrj7yeggu",
		jobId: null,
		organizationId: "kwexx705yFgYVMHWjbFCANbKbsxngJCS",
		userId: "KaNiK1XYGImcl07by8cbwcCs1iYyGgJr",
		email: "pranav@gmai.com",
		state: "deliverable",
		score: 80,
		reason: "valid_mailbox",
		result: {
			tag: null,
			user: "pranav",
			email: "pranav@gmai.com",
			score: 80,
			state: "deliverable",
			checks: {
				dns: {
					hasMx: true,
					valid: true,
					mxRecords: ["mail.h-email.net"],
					preferredMx: "mail.h-email.net",
					domainExists: true,
				},
				role: {
					isRole: false,
				},
				smtp: {
					valid: null,
					isCatchAll: null,
					mailboxExists: null,
				},
				typo: {
					hasTypo: true,
					suggestion: "pranav@gmail.com",
					originalDomain: "gmai.com",
					suggestedDomain: "gmail.com",
				},
				syntax: {
					valid: true,
				},
				disposable: {
					isDisposable: false,
				},
				freeProvider: {
					isFree: false,
				},
			},
			domain: "gmai.com",
			reason: "valid_mailbox",
			duration: 587,
			analytics: {
				warnings: ["possible_typo"],
				domainAge: null,
				riskLevel: "medium",
				didYouMean: "pranav@gmail.com",
				smtpProvider: null,
				qualityIndicators: [
					"valid_syntax",
					"domain_exists",
					"has_mx_records",
					"not_disposable",
					"personal_email",
				],
			},
			verifiedAt: "2026-01-04T09:06:35.289Z",
		},
		createdAt: "2026-01-04T09:06:35.312Z",
	},
};

export function ResponseDisplay() {
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

	const { data } = mockResponse;

	return (
		<div className="-mt-[51px] mx-auto max-w-7xl">
			<div className="border-stroke-soft-100/60 border-r border-l">
				<div className="mx-auto max-w-4xl border-stroke-soft-100/60 border-r border-l pt-24">
					<div className="border-stroke-soft-100/60 border-t">
						<ResponseHeader email={data.email} score={data.score} />
						<ScoreVisualization score={data.score} />
						<div className="border-stroke-soft-100/60 border-t border-b">
							<div className="relative flex w-fit gap-2 bg-bg-white-0 px-4 py-3">
								{/* Animated floating background */}
								<div
									className={`absolute inset-y-3 rounded-full border border-stroke-soft-200 bg-bg-white-100 transition-all duration-300 ${
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
							<div className="grid grid-cols-2 border-stroke-soft-100/60">
								{/* Left Column: General and Mail Server */}
								<div className="border-stroke-soft-100/60 border-r">
									<GeneralSection
										state={data.state}
										reason={data.reason}
										domain={data.result.domain}
										didYouMean={data.result.analytics.didYouMean}
									/>
									<MailServerSection
										smtpProvider={data.result.analytics.smtpProvider}
										mxRecord={data.result.checks.dns.preferredMx}
									/>
								</div>

								{/* Right Column: Attributes */}
								<div>
									<AttributesSection
										isFree={data.result.checks.freeProvider.isFree}
										isRole={data.result.checks.role.isRole}
										isDisposable={data.result.checks.disposable.isDisposable}
										isCatchAll={data.result.checks.smtp.isCatchAll}
										tag={data.result.tag}
									/>
								</div>
							</div>
						) : (
							<JsonViewer data={mockResponse} filename="response.json" />
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
