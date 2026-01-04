"use client";

import { Icon } from "@verifio/ui/icon";
import { useState } from "react";
import * as SegmentedControl from "@verifio/ui/segmented-control";
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

	const { data } = mockResponse;

	return (
		<div className="-mt-[61px] mx-auto max-w-7xl">
			<div className="border-stroke-soft-100/60 border-r border-l">
				<div className="mx-auto max-w-4xl border-stroke-soft-100/60 border-r border-l pt-24">
					<SegmentedControl.Root
						value={viewMode}
						onValueChange={(value) => setViewMode(value as "details" | "json")}
					>
						<div className="border-stroke-soft-100/60 border-t">
							{/* Header with avatar, email and score */}
							<ResponseHeader email={data.email} score={data.score} />

							{/* Score Visualization Bar */}
							<ScoreVisualization score={data.score} />

							{/* Tab Controls */}
							<div className="flex items-center justify-end border-stroke-soft-100/60 border-t px-6 py-3">
								<SegmentedControl.List>
									<SegmentedControl.Trigger
										value="details"
										className="font-medium text-sm"
									>
										<Icon name="file-text" className="h-3.5 w-3.5" />
										Details
									</SegmentedControl.Trigger>
									<SegmentedControl.Trigger
										value="json"
										className="font-medium text-sm"
									>
										<Icon name="code-01" className="h-3.5 w-3.5" />
										JSON
									</SegmentedControl.Trigger>
								</SegmentedControl.List>
							</div>

							{/* Details View */}
							<SegmentedControl.Content value="details">
								{/* Two-column grid layout */}
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
							</SegmentedControl.Content>

							{/* JSON View */}
							<SegmentedControl.Content value="json">
								<JsonViewer data={mockResponse} filename="response.json" />
							</SegmentedControl.Content>
						</div>
					</SegmentedControl.Root>
				</div>
			</div>
		</div>
	);
}
