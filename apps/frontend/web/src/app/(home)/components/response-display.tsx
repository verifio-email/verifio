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

	// Get score color based on value
	const getScoreColor = (score: number) => {
		if (score >= 80) return "text-success-base";
		if (score >= 50) return "text-warning-base";
		return "text-error-base";
	};

	// Get score position percentage
	const getScorePosition = (score: number) => {
		return `${score}%`;
	};

	return (
		<div className="mx-auto max-w-7xl">
			<div className="border-stroke-soft-100/60 border-r border-b border-l">
				<div className="mx-auto max-w-5xl border-stroke-soft-100/60 border-r border-l">
					<SegmentedControl.Root
						value={viewMode}
						onValueChange={(value) => setViewMode(value as "details" | "json")}
					>
						<div className="border-stroke-soft-100/60 border-b">
							{/* Header with avatar, email and score */}
							<div className="flex items-center justify-between border-stroke-soft-100/60 border-b px-6 py-4">
								<div className="flex items-center gap-3">
									{/* Avatar */}
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-base text-white font-semibold">
										{data.email.charAt(0).toUpperCase()}
									</div>
									<div className="flex items-center gap-2">
										<span className="font-semibold text-text-strong-950">
											{data.email}
										</span>
										<Icon name="copy" className="h-4 w-4 text-text-sub-600" />
									</div>
								</div>
								<Badge.Root
									variant="light"
									color={
										data.score >= 80
											? "green"
											: data.score >= 50
												? "orange"
												: "red"
									}
									size="medium"
								>
									{data.score}
								</Badge.Root>
							</div>

							{/* Score Visualization Bar */}
							<div className="px-6 py-6">
								<div className="relative">
									{/* Score indicator circle */}
									<div
										className="absolute -top-3 flex h-12 w-12 items-center justify-center rounded-full bg-error-lighter text-error-base font-semibold text-sm"
										style={{
											left: getScorePosition(data.score),
											transform: "translateX(-50%)",
										}}
									>
										{data.score}
									</div>
									{/* Progress bar */}
									<div className="mt-6 h-2 w-full rounded-full bg-stroke-soft-100">
										<div className="relative h-full">
											{/* Gradient segments */}
											<div className="absolute inset-0 flex">
												<div className="h-full w-[20%] rounded-l-full bg-error-base" />
												<div className="h-full w-[30%] bg-warning-base" />
												<div className="h-full w-[50%] rounded-r-full bg-success-base" />
											</div>
										</div>
									</div>
									{/* Labels */}
									<div className="mt-2 flex justify-between text-xs text-text-sub-600">
										<span>0</span>
										<span>20</span>
										<span>50</span>
										<span>80</span>
										<span>100</span>
									</div>
								</div>
							</div>

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
								<div className="grid grid-cols-2 border-stroke-soft-100/60 border-t">
									{/* Left Column: General and Mail Server */}
									<div className="border-stroke-soft-100/60 border-r">
										{/* General Section */}
										<div className="px-6 py-4">
											<h4 className="mb-4 font-semibold text-sm text-text-strong-950">
												General
											</h4>
											<div className="divide-y divide-stroke-soft-100/60">
												<div className="flex items-center justify-between py-3 first:pt-0">
													<span className="text-sm text-text-sub-600">
														Full Name
													</span>
													<span className="text-sm text-text-sub-600">—</span>
												</div>
												<div className="flex items-center justify-between py-3 first:pt-0">
													<span className="text-sm text-text-sub-600">
														Gender
													</span>
													<span className="text-sm text-text-sub-600">—</span>
												</div>
												<div className="flex items-center justify-between py-3 first:pt-0">
													<span className="text-sm text-text-sub-600">
														State
													</span>
													<div className="flex items-center gap-2">
														<Badge.Root
															variant="light"
															color={
																data.state === "deliverable" ? "green" : "red"
															}
															size="small"
														>
															<Icon
																name={
																	data.state === "deliverable"
																		? "check-circle"
																		: "cross-circle"
																}
																className="h-3 w-3"
															/>
															{data.state === "deliverable"
																? "Deliverable"
																: data.state}
														</Badge.Root>
														{data.state !== "deliverable" && (
															<Badge.Root
																variant="lighter"
																color="red"
																size="small"
															>
																0x
															</Badge.Root>
														)}
													</div>
												</div>
												<div className="flex items-center justify-between py-3 first:pt-0">
													<span className="text-sm text-text-sub-600">
														Reason
													</span>
													<Badge.Root
														variant="lighter"
														color="blue"
														size="small"
													>
														{data.reason.toUpperCase().replace(/_/g, " ")}
													</Badge.Root>
												</div>
												<div className="flex items-center justify-between py-3 first:pt-0">
													<span className="text-sm text-text-sub-600">
														Domain
													</span>
													<span className="text-sm font-mono text-primary-base">
														{data.result.domain}
													</span>
												</div>
												{data.result.analytics.didYouMean && (
													<div className="flex items-center justify-between py-3 first:pt-0">
														<span className="text-sm text-text-sub-600">
															Did you mean
														</span>
														<div className="flex items-center gap-2">
															<span className="text-sm font-mono text-text-strong-950">
																{data.result.analytics.didYouMean}
															</span>
															<Badge.Root
																variant="lighter"
																color="blue"
																size="small"
															>
																0.9x
															</Badge.Root>
														</div>
													</div>
												)}
											</div>
										</div>

										{/* Mail Server Section */}
										<div className="border-stroke-soft-100/60 border-t px-6 py-4">
											<h4 className="mb-4 font-semibold text-sm text-text-strong-950">
												Mail Server
											</h4>
											<div className="divide-y divide-stroke-soft-100/60">
												<div className="flex items-center justify-between py-3 first:pt-0">
													<span className="text-sm text-text-sub-600">
														SMTP Provider
													</span>
													<span className="text-sm text-text-sub-600">—</span>
												</div>
												<div className="flex items-center justify-between py-3 first:pt-0">
													<span className="text-sm text-text-sub-600">
														MX Record
													</span>
													<span className="text-sm font-mono text-text-strong-950">
														{data.result.checks.dns.preferredMx ||
															data.result.analytics.smtpProvider ||
															"—"}
													</span>
												</div>
												<div className="flex items-center justify-between py-3 first:pt-0">
													<span className="text-sm text-text-sub-600">
														Implicit MX Record
													</span>
													<span className="text-sm text-text-sub-600">—</span>
												</div>
											</div>
										</div>
									</div>

									{/* Right Column: Attributes */}
									<div>
										<div className="px-6 py-4">
											<h4 className="mb-4 font-semibold text-sm text-text-strong-950">
												Attributes
											</h4>
											<div className="divide-y divide-stroke-soft-100/60">
												<div className="flex items-center justify-between py-3 first:pt-0">
													<div className="flex items-center gap-2">
														<Icon
															name="dollar"
															className="h-3.5 w-3.5 text-primary-base"
														/>
														<span className="text-sm text-text-sub-600">
															Free
														</span>
													</div>
													<span className="text-sm text-text-strong-950">
														{data.result.checks.freeProvider.isFree
															? "Yes"
															: "No"}
													</span>
												</div>
												<div className="flex items-center justify-between py-3 first:pt-0">
													<div className="flex items-center gap-2">
														<Icon
															name="users"
															className="h-3.5 w-3.5 text-primary-base"
														/>
														<span className="text-sm text-text-sub-600">
															Role
														</span>
													</div>
													<span className="text-sm text-text-strong-950">
														{data.result.checks.role.isRole ? "Yes" : "No"}
													</span>
												</div>
												<div className="flex items-center justify-between py-3 first:pt-0">
													<div className="flex items-center gap-2">
														<Icon
															name="trash"
															className="h-3.5 w-3.5 text-primary-base"
														/>
														<span className="text-sm text-text-sub-600">
															Disposable
														</span>
													</div>
													<span className="text-sm text-text-strong-950">
														{data.result.checks.disposable.isDisposable
															? "Yes"
															: "No"}
													</span>
												</div>
												<div className="flex items-center justify-between py-3 first:pt-0">
													<div className="flex items-center gap-2">
														<Icon
															name="check-circle"
															className="h-3.5 w-3.5 text-primary-base"
														/>
														<span className="text-sm text-text-sub-600">
															Accept-All
														</span>
													</div>
													<span className="text-sm text-text-strong-950">
														{data.result.checks.smtp.isCatchAll === null
															? "No"
															: data.result.checks.smtp.isCatchAll
																? "Yes"
																: "No"}
													</span>
												</div>
												<div className="flex items-center justify-between py-3 first:pt-0">
													<div className="flex items-center gap-2">
														<Icon
															name="hash"
															className="h-3.5 w-3.5 text-primary-base"
														/>
														<span className="text-sm text-text-sub-600">
															Tag
														</span>
													</div>
													<span className="text-sm text-text-strong-950">
														{data.result.tag || "No"}
													</span>
												</div>
												<div className="flex items-center justify-between py-3 first:pt-0">
													<div className="flex items-center gap-2">
														<Icon
															name="hash"
															className="h-3.5 w-3.5 text-primary-base"
														/>
														<span className="text-sm text-text-sub-600">
															Numerical Characters
														</span>
													</div>
													<span className="text-sm text-text-strong-950">
														0
													</span>
												</div>
												<div className="flex items-center justify-between py-3 first:pt-0">
													<div className="flex items-center gap-2">
														<Icon
															name="file-text"
															className="h-3.5 w-3.5 text-primary-base"
														/>
														<span className="text-sm text-text-sub-600">
															Alphabetical Characters
														</span>
													</div>
													<span className="text-sm text-text-strong-950">
														6
													</span>
												</div>
												<div className="flex items-center justify-between py-3 first:pt-0">
													<div className="flex items-center gap-2">
														<Icon
															name="globe"
															className="h-3.5 w-3.5 text-primary-base"
														/>
														<span className="text-sm text-text-sub-600">
															Unicode Symbols
														</span>
													</div>
													<span className="text-sm text-text-strong-950">
														0
													</span>
												</div>
												<div className="flex items-center justify-between py-3 first:pt-0">
													<div className="flex items-center gap-2">
														<Icon
															name="at-filled"
															className="h-3.5 w-3.5 text-primary-base"
														/>
														<span className="text-sm text-text-sub-600">
															Mailbox Full
														</span>
													</div>
													<span className="text-sm text-text-strong-950">
														No
													</span>
												</div>
												<div className="flex items-center justify-between py-3 first:pt-0">
													<div className="flex items-center gap-2">
														<Icon
															name="cross-circle"
															className="h-3.5 w-3.5 text-primary-base"
														/>
														<span className="text-sm text-text-sub-600">
															No Reply
														</span>
													</div>
													<span className="text-sm text-text-strong-950">
														No
													</span>
												</div>
												<div className="flex items-center justify-between py-3 first:pt-0">
													<div className="flex items-center gap-2">
														<Icon
															name="lock"
															className="h-3.5 w-3.5 text-primary-base"
														/>
														<span className="text-sm text-text-sub-600">
															Secure Email Gateway
														</span>
													</div>
													<span className="text-sm text-text-strong-950">
														No
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</SegmentedControl.Content>

							{/* JSON View */}
							<SegmentedControl.Content value="json">
								<div className="border-stroke-soft-100/60 border-t">
									<div className="flex items-center justify-between border-stroke-soft-100/60 border-b px-4 py-2">
										<span className="text-xs font-mono text-text-sub-600">
											response.json
										</span>
										<Button.Root
											mode="lighter"
											size="xsmall"
											onClick={() => copyToClipboard(jsonString)}
										>
											<Icon
												name="copy"
												className="h-3.5 w-3.5 stroke-1 text-text-sub-600"
											/>
											Copy
										</Button.Root>
									</div>
									<div className="max-h-96 overflow-auto bg-[#1e1e1e]">
										<div className="flex">
											{/* Line Numbers */}
											<div className="sticky left-0 z-10 border-r border-stroke-soft-200 bg-[#252526] px-4 py-4 text-right text-xs font-mono leading-6 text-[#858585]">
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
