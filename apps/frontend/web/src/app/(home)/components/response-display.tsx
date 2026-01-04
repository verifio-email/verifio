"use client";

import { Icon } from "@verifio/ui/icon";
import { useState } from "react";
import * as Badge from "@verifio/ui/badge";
import * as SegmentedControl from "@verifio/ui/segmented-control";
import * as Button from "@verifio/ui/button";

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

const copyToClipboard = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text);
	} catch (err) {
		console.error("Failed to copy:", err);
	}
};

const highlightJSON = (json: string) => {
	const lines = json.split("\n");
	return lines.map((line, lineIndex) => {
		// Basic JSON syntax highlighting
		const patterns = [
			// String values (after colon)
			{
				regex: /: "([^"]*)"/g,
				className: "text-[#ce9178]",
			},
			// Property names
			{
				regex: /"([^"]+)":/g,
				className: "text-[#9cdcfe]",
			},
			// Numbers
			{
				regex: /\b(\d+)\b/g,
				className: "text-[#b5cea8]",
			},
			// Booleans and null
			{
				regex: /\b(true|false|null)\b/g,
				className: "text-[#569cd6]",
			},
		];

		const parts: Array<{ text: string; className?: string }> = [];
		let lastIndex = 0;

		const matches: Array<{
			start: number;
			end: number;
			className: string;
		}> = [];

		patterns.forEach((pattern) => {
			const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
			let match = regex.exec(line);
			while (match !== null) {
				matches.push({
					start: match.index,
					end: match.index + match[0].length,
					className: pattern.className,
				});
				match = regex.exec(line);
			}
		});

		matches.sort((a, b) => a.start - b.start);

		const mergedMatches: Array<{
			start: number;
			end: number;
			className: string;
		}> = [];
		matches.forEach((match) => {
			const overlapping = mergedMatches.find(
				(m) => !(match.end <= m.start || match.start >= m.end),
			);
			if (!overlapping) {
				mergedMatches.push(match);
			}
		});

		mergedMatches.forEach((match) => {
			if (match.start > lastIndex) {
				parts.push({ text: line.slice(lastIndex, match.start) });
			}
			parts.push({
				text: line.slice(match.start, match.end),
				className: match.className,
			});
			lastIndex = Math.max(lastIndex, match.end);
		});

		if (lastIndex < line.length) {
			parts.push({ text: line.slice(lastIndex) });
		}

		if (parts.length === 0) {
			parts.push({ text: line });
		}

		return (
			<span key={lineIndex} className="block">
				{parts.map((part, partIndex) => (
					<span key={partIndex} className={part.className}>
						{part.text}
					</span>
				))}
				{line === "" && "\u00A0"}
			</span>
		);
	});
};

export function ResponseDisplay() {
	const [viewMode, setViewMode] = useState<"details" | "json">("details");

	const jsonString = JSON.stringify(mockResponse, null, 2);
	const { data } = mockResponse;

	return (
		<div className="mx-auto max-w-7xl">
			<div className="border-stroke-soft-100/60 border-r border-b border-l">
				<div className="mx-auto max-w-3xl border-stroke-soft-100/60 border-r border-l">
					<SegmentedControl.Root
						value={viewMode}
						onValueChange={(value) => setViewMode(value as "details" | "json")}
					>
						<div className="border-stroke-soft-100/60 border-b">
							{/* Header with segmented control */}
							<div className="flex items-center justify-between px-6 py-4">
								<div className="flex items-center gap-2">
									<Icon
										name="check-verified-02"
										className="h-4 w-4 text-success-base"
									/>
									<span className="font-medium text-sm text-text-strong-950">
										Verification Result
									</span>
								</div>
								<SegmentedControl.List>
									<SegmentedControl.Trigger
										value="details"
										className="font-medium text-sm"
									>
										<Icon name="file-02" className="h-3.5 w-3.5" />
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
								<div className="space-y-6 p-6">
									{/* Email and State */}
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<span className="text-sm text-text-sub-600">Email</span>
											<span className="font-mono text-sm text-text-strong-950">
												{data.email}
											</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm text-text-sub-600">State</span>
											<Badge.Root
												variant="light"
												color={data.state === "deliverable" ? "green" : "red"}
												size="medium"
											>
												<Badge.Icon
													as={Icon}
													name={
														data.state === "deliverable"
															? "check-circle"
															: "x-circle"
													}
												/>
												{data.state}
											</Badge.Root>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm text-text-sub-600">
												Quality Score
											</span>
											<Badge.Root
												variant="light"
												color={
													data.score >= 80
														? "green"
														: data.score >= 50
															? "yellow"
															: "red"
												}
												size="medium"
											>
												{data.score}/100
											</Badge.Root>
										</div>
									</div>

									<div className="border-stroke-soft-100 border-t" />

									{/* Checks Grid */}
									<div className="space-y-3">
										<h3 className="font-medium text-sm text-text-strong-950">
											Validation Checks
										</h3>
										<div className="grid grid-cols-2 gap-3">
											<div className="flex items-center justify-between rounded-lg border border-stroke-soft-100 bg-bg-weak-50 px-3 py-2">
												<span className="text-text-sub-600 text-xs">
													Disposable
												</span>
												<Badge.Root
													variant="lighter"
													color={
														data.result.checks.disposable.isDisposable
															? "red"
															: "green"
													}
													size="small"
												>
													{data.result.checks.disposable.isDisposable
														? "Yes"
														: "No"}
												</Badge.Root>
											</div>
											<div className="flex items-center justify-between rounded-lg border border-stroke-soft-100 bg-bg-weak-50 px-3 py-2">
												<span className="text-text-sub-600 text-xs">
													Role Account
												</span>
												<Badge.Root
													variant="lighter"
													color={
														data.result.checks.role.isRole ? "orange" : "green"
													}
													size="small"
												>
													{data.result.checks.role.isRole ? "Yes" : "No"}
												</Badge.Root>
											</div>
											<div className="flex items-center justify-between rounded-lg border border-stroke-soft-100 bg-bg-weak-50 px-3 py-2">
												<span className="text-text-sub-600 text-xs">
													Valid Syntax
												</span>
												<Badge.Root
													variant="lighter"
													color={
														data.result.checks.syntax.valid ? "green" : "red"
													}
													size="small"
												>
													{data.result.checks.syntax.valid ? "Yes" : "No"}
												</Badge.Root>
											</div>
											<div className="flex items-center justify-between rounded-lg border border-stroke-soft-100 bg-bg-weak-50 px-3 py-2">
												<span className="text-text-sub-600 text-xs">
													MX Records
												</span>
												<Badge.Root
													variant="lighter"
													color={data.result.checks.dns.hasMx ? "green" : "red"}
													size="small"
												>
													{data.result.checks.dns.hasMx ? "Found" : "None"}
												</Badge.Root>
											</div>
										</div>
									</div>

									{/* Warnings */}
									{data.result.analytics.warnings.length > 0 && (
										<>
											<div className="border-stroke-soft-100 border-t" />
											<div className="space-y-2">
												<h3 className="font-medium text-sm text-text-strong-950">
													Warnings
												</h3>
												{data.result.analytics.didYouMean && (
													<div className="flex items-start gap-2 rounded-lg border border-warning-light bg-warning-lighter p-3">
														<Icon
															name="alert-triangle"
															className="h-4 w-4 shrink-0 text-warning-base"
														/>
														<div className="flex-1">
															<p className="text-sm text-warning-dark">
																Did you mean{" "}
																<span className="font-mono font-semibold">
																	{data.result.analytics.didYouMean}
																</span>
																?
															</p>
														</div>
													</div>
												)}
											</div>
										</>
									)}

									{/* Risk Level */}
									<div className="border-stroke-soft-100 border-t" />
									<div className="flex items-center justify-between">
										<span className="text-sm text-text-sub-600">
											Risk Level
										</span>
										<Badge.Root
											variant="light"
											color={
												data.result.analytics.riskLevel === "low"
													? "green"
													: data.result.analytics.riskLevel === "medium"
														? "yellow"
														: "red"
											}
											size="medium"
										>
											<Badge.Icon
												as={Icon}
												name={
													data.result.analytics.riskLevel === "low"
														? "shield-tick"
														: data.result.analytics.riskLevel === "medium"
															? "shield-zap"
															: "shield-off"
												}
											/>
											{data.result.analytics.riskLevel}
										</Badge.Root>
									</div>
								</div>
							</SegmentedControl.Content>

							{/* JSON View */}
							<SegmentedControl.Content value="json">
								<div className="border-stroke-soft-100/60 border-t">
									<div className="flex items-center justify-between border-stroke-soft-100/60 border-b px-4 py-2">
										<span className="font-mono text-text-sub-600 text-xs">
											response.json
										</span>
										<Button.Root
											mode="lighter"
											size="xsmall"
											onClick={() => copyToClipboard(jsonString)}
										>
											<Icon
												name="clipboard-copy"
												className="h-3.5 w-3.5 stroke-1 text-text-sub-600"
											/>
											Copy
										</Button.Root>
									</div>
									<div className="max-h-96 overflow-auto bg-[#1e1e1e]">
										<div className="flex">
											{/* Line Numbers */}
											<div className="sticky left-0 z-10 border-stroke-soft-200 border-r bg-[#252526] px-4 py-4 text-right font-mono text-[#858585] text-xs leading-6">
												{jsonString.split("\n").map((_, index) => (
													<div key={index} className="select-none">
														{index + 1}
													</div>
												))}
											</div>
											{/* JSON Content */}
											<div className="flex-1 px-6 py-4">
												<pre className="font-mono text-sm leading-6">
													<code className="block text-[#d4d4d4]">
														{highlightJSON(jsonString)}
													</code>
												</pre>
											</div>
										</div>
									</div>
								</div>
							</SegmentedControl.Content>
						</div>
					</SegmentedControl.Root>
				</div>
			</div>
		</div>
	);
}
