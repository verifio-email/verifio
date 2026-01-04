"use client";

import { PageSizeDropdown } from "@fe/dashboard/components/page-size-dropdown";
import { PaginationControls } from "@fe/dashboard/components/pagination-controls";
import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import { useSidebar } from "@fe/dashboard/providers/sidebar-provider";
import { getProviderIcon } from "@fe/dashboard/utils/email-provider-icon";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import * as Input from "@verifio/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type TabType = "single" | "bulk";

// Verification result types matching the API response
interface VerificationResult {
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
}

interface RecentRun {
	id: string;
	email: string;
	result: VerificationResult;
	timestamp: Date;
}

const PlaygroundPage = () => {
	const { push } = useUserOrganization();
	const { isCollapsed } = useSidebar();
	const [activeTab, setActiveTab] = useState<TabType>("single");
	const [email, setEmail] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [recentRuns, setRecentRuns] = useState<RecentRun[]>([]);
	const [currentResult, setCurrentResult] = useState<VerificationResult | null>(
		null,
	);
	const [csvFile, setCsvFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [bulkProgress, setBulkProgress] = useState<{
		jobId: string;
		status: string;
		progress: number;
		total: number;
	} | null>(null);
	const [bulkResults, setBulkResults] = useState<{
		results: VerificationResult[];
		stats: {
			total: number;
			deliverable: number;
			undeliverable: number;
			risky: number;
			unknown: number;
			averageScore: number;
		} | null;
	} | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isLoadingHistory, setIsLoadingHistory] = useState(true);
	const [historyPage, setHistoryPage] = useState(1);
	const [historyTotalPages, setHistoryTotalPages] = useState(1);
	const [pastBulkJobs, setPastBulkJobs] = useState<
		Array<{
			id: string;
			name: string | null;
			status: string;
			totalEmails: number;
			processedEmails: number;
			stats: {
				deliverable: number;
				undeliverable: number;
				risky: number;
				unknown: number;
				averageScore: number;
			} | null;
			createdAt: string;
			completedAt: string | null;
		}>
	>([]);
	const [isLoadingBulkJobs, setIsLoadingBulkJobs] = useState(false);
	// Bulk results pagination and search
	const [bulkResultsPage, setBulkResultsPage] = useState(1);
	const [bulkResultsSearch, setBulkResultsSearch] = useState("");
	const [bulkResultsPageSize, setBulkResultsPageSize] = useState(10);

	// Fetch verification history from database
	const fetchHistory = async (page = 1) => {
		setIsLoadingHistory(true);
		try {
			const response = await fetch(
				`/api/verify/v1/history?limit=10&page=${page}`,
				{
					credentials: "include",
				},
			);
			const data = await response.json();

			if (data.success && data.data?.results) {
				const historyRuns: RecentRun[] = data.data.results.map(
					(item: {
						id: string;
						email: string;
						state: string;
						score: number;
						reason: string;
						createdAt: string;
					}) => ({
						id: item.id,
						email: item.email,
						result: {
							email: item.email,
							state: item.state,
							score: item.score,
							reason: item.reason,
						} as VerificationResult,
						timestamp: new Date(item.createdAt),
					}),
				);
				setRecentRuns(historyRuns);
				setHistoryPage(data.data.pagination?.page ?? 1);
				setHistoryTotalPages(data.data.pagination?.totalPages ?? 1);
			}
		} catch (error) {
			console.error("Failed to fetch history:", error);
		} finally {
			setIsLoadingHistory(false);
		}
	};

	// Fetch bulk jobs from database
	const fetchBulkJobs = async () => {
		setIsLoadingBulkJobs(true);
		try {
			const response = await fetch("/api/verify/v1/jobs?limit=10", {
				credentials: "include",
			});
			const data = await response.json();

			if (data.success && data.data?.jobs) {
				setPastBulkJobs(data.data.jobs);
			}
		} catch (error) {
			console.error("Failed to fetch bulk jobs:", error);
		} finally {
			setIsLoadingBulkJobs(false);
		}
	};

	// Fetch history on mount
	useEffect(() => {
		fetchHistory();
	}, []);

	// Fetch bulk jobs when switching to Bulk tab
	useEffect(() => {
		if (activeTab === "bulk") {
			fetchBulkJobs();
		}
	}, [activeTab]);

	const tabs = [
		{ id: "single" as TabType, label: "Verify", dots: 3 },
		{ id: "bulk" as TabType, label: "Bulk", dots: 2, badge: "New" },
	];

	// Call the verification API
	const handleVerify = async () => {
		if (!email.trim()) {
			toast.error("Please enter an email address");
			return;
		}

		setIsVerifying(true);
		setCurrentResult(null);

		try {
			// Call the authenticated verify API (stores result in DB)
			const response = await fetch("/api/verify/v1/verify", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include", // Include cookies for auth
				body: JSON.stringify({ email: email.trim() }),
			});

			const data = await response.json();

			if (data.success && data.data) {
				const result = data.data as VerificationResult;
				setCurrentResult(result);

				const newRun: RecentRun = {
					id: Date.now().toString(),
					email: result.email,
					result: result,
					timestamp: new Date(),
				};

				setRecentRuns([newRun, ...recentRuns.slice(0, 9)]);

				if (result.state === "deliverable") {
					toast.success(`Email verified! Score: ${result.score}/100`);
				} else if (result.state === "risky") {
					toast.warning(`Email is risky: ${result.reason}`);
				} else {
					toast.error(`Email undeliverable: ${result.reason}`);
				}
			} else {
				toast.error(data.error || "Verification failed");
			}
		} catch (error) {
			console.error("Verification error:", error);
			toast.error("Failed to verify email. Is the verify service running?");
		} finally {
			setIsVerifying(false);
		}
	};

	const handleGetCode = () => {
		const codeSnippet = `fetch('https://api.verifio.email/api/verify/v1/email', {
  method: 'POST',
  headers: {
    'X-API-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email: '${email || "example@email.com"}' })
})
.then(res => res.json())
.then(data => {
  console.log('State:', data.data.state);
  console.log('Score:', data.data.score);
  console.log('Risk:', data.data.analytics.riskLevel);
});`;

		navigator.clipboard.writeText(codeSnippet);
		toast.success("Code copied to clipboard!");
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files[0];
		if (file && file.type === "text/csv") {
			setCsvFile(file);
			toast.success(`File "${file.name}" ready for upload`);
		} else {
			toast.error("Please upload a CSV file");
		}
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && file.type === "text/csv") {
			setCsvFile(file);
			toast.success(`File "${file.name}" ready for upload`);
		} else {
			toast.error("Please upload a CSV file");
		}
	};

	const handleBrowseClick = () => {
		fileInputRef.current?.click();
	};

	const parseCSV = async (file: File): Promise<string[]> => {
		const text = await file.text();
		const lines = text.split("\n").filter((line) => line.trim());
		const emails: string[] = [];

		for (const line of lines) {
			// Simple email extraction - assumes first column or whole line is email
			const parts = line.split(",");
			const firstPart = parts[0];
			if (!firstPart) continue;
			const potential = firstPart.trim().replace(/["']/g, "");
			if (potential.includes("@")) {
				emails.push(potential);
			}
		}

		return emails;
	};

	const handleBulkVerify = async () => {
		if (!csvFile) {
			toast.error("Please upload a CSV file first");
			return;
		}

		setIsVerifying(true);
		setBulkProgress(null);

		try {
			// Parse CSV
			const emails = await parseCSV(csvFile);

			if (emails.length === 0) {
				toast.error("No valid emails found in CSV");
				setIsVerifying(false);
				return;
			}

			toast.info(`Found ${emails.length} emails. Starting verification...`);

			// Call authenticated bulk verify API (stores to DB)
			const response = await fetch("/api/verify/v1/bulk-verify", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ emails, name: csvFile.name }),
			});

			const data = await response.json();

			if (data.success && data.data?.jobId) {
				const jobId = data.data.jobId;
				setBulkProgress({
					jobId,
					status: "processing",
					progress: 0,
					total: emails.length,
				});

				// Poll for status using authenticated endpoint
				const pollStatus = async () => {
					const statusRes = await fetch(`/api/verify/v1/bulk-jobs/${jobId}`, {
						credentials: "include",
					});
					const statusData = await statusRes.json();

					if (statusData.success && statusData.data) {
						const job = statusData.data;
						setBulkProgress({
							jobId,
							status: job.status,
							progress: job.progress,
							total: job.total,
						});

						if (job.status === "completed") {
							// Fetch the results from DB
							try {
								const resultsRes = await fetch(
									`/api/verify/v1/bulk-jobs/${jobId}/results`,
									{ credentials: "include" },
								);
								const resultsData = await resultsRes.json();
								if (resultsData.success && resultsData.data) {
									setBulkResults({
										results: resultsData.data.results,
										stats: resultsData.data.stats,
									});
								}
							} catch (e) {
								console.error("Failed to fetch results:", e);
							}
							toast.success(
								`Bulk verification completed! ${job.stats?.deliverable || 0} deliverable.`,
							);
							setIsVerifying(false);
						} else if (job.status === "failed") {
							toast.error("Bulk verification failed");
							setIsVerifying(false);
						} else {
							// Continue polling
							setTimeout(pollStatus, 1000);
						}
					}
				};

				pollStatus();
			} else {
				toast.error(data.error || "Failed to start bulk verification");
				setIsVerifying(false);
			}
		} catch (error) {
			console.error("Bulk verification error:", error);
			toast.error("Failed to process CSV. Is the verify service running?");
			setIsVerifying(false);
		}
	};

	// Get score color
	const getScoreColor = (score: number) => {
		if (score >= 90) return "text-success-base";
		if (score >= 70) return "text-primary-base";
		if (score >= 50) return "text-warning-base";
		return "text-error-base";
	};

	// Get state badge style
	const getStateBadge = (state: string) => {
		switch (state) {
			case "deliverable":
				return "bg-success-alpha-10 text-success-base";
			case "risky":
				return "bg-warning-alpha-10 text-warning-base";
			case "undeliverable":
				return "bg-error-alpha-10 text-error-base";
			default:
				return "bg-bg-weak-50 text-text-sub-600";
		}
	};

	return (
		<div className="flex-1 overflow-y-auto">
			{/* Header Section */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className="px-[340px] 2xl:px-[450px]">
					<div className="relative border-stroke-soft-200/50 border-r border-l pt-24 pb-12 text-center">
						<h1 className="relative font-semibold text-2xl text-text-strong-950 md:text-3xl">
							Playground
						</h1>
						<p className="relative mt-2 text-text-sub-600">
							Verify emails instantly with deep analytics
						</p>
					</div>
				</div>
			</div>

			{/* Tab Navigation Section */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className="px-[340px] 2xl:px-[450px]">
					<div className="flex items-center justify-center border-stroke-soft-200/50 border-r border-l py-6">
						{/* Tab container with gray background */}
						<div className="relative flex items-center gap-1 rounded-xl bg-bg-weak-50 p-0.5">
							{tabs.map((tab) => (
								<button
									key={tab.id}
									type="button"
									onClick={() => setActiveTab(tab.id)}
									className={cn(
										"group relative z-10 flex cursor-pointer items-center justify-center gap-2 rounded-lg px-8 py-2",
										"transition-colors duration-200 ease-out",
										activeTab === tab.id
											? "text-text-strong-950"
											: "text-text-sub-600 hover:text-text-strong-950",
									)}
								>
									{/* Animated background for active tab */}
									{activeTab === tab.id && (
										<motion.div
											layoutId="activeTabBackground"
											className="absolute inset-0 rounded-lg bg-bg-white-0"
											style={{
												boxShadow:
													"rgba(0, 0, 0, 0.04) 0px 6px 12px -3px, rgba(0, 0, 0, 0.04) 0px 3px 6px -1px, rgba(0, 0, 0, 0.04) 0px 1px 2px 0px, rgba(0, 0, 0, 0.06) 0px 0.5px 0.5px 0px",
											}}
											transition={{
												type: "spring",
												stiffness: 500,
												damping: 35,
											}}
										/>
									)}
									{/* Dot pattern icon */}
									<span
										className={cn(
											"relative z-10 flex items-center gap-[2px] transition-colors duration-200",
											activeTab === tab.id
												? "text-primary-base"
												: "text-text-soft-400 group-hover:text-text-sub-600",
										)}
									>
										{Array.from({ length: tab.dots }).map((_, i) => (
											<span key={i} className="flex flex-col gap-[2px]">
												<span className="h-[3px] w-[3px] rounded-full bg-current" />
												<span className="h-[3px] w-[3px] rounded-full bg-current" />
											</span>
										))}
									</span>
									<span className="label-sm relative z-10">{tab.label}</span>
									{tab.badge && (
										<span className="relative z-10 rounded bg-bg-soft-200 px-1.5 py-0.5 font-medium text-[10px] text-text-sub-600">
											{tab.badge}
										</span>
									)}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Input Section */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className="px-[340px] 2xl:px-[450px]">
					<div className="border-stroke-soft-200/50 border-r border-l px-7 py-8">
						<div className="mx-auto max-w-3xl">
							{/* Boxy container with sharp corners */}
							<div className="overflow-hidden border border-stroke-soft-200/50 bg-bg-white-0">
								{activeTab === "single" ? (
									<>
										{/* Single Email Input */}
										<label className="block cursor-text overflow-hidden p-3">
											<div className="flex items-center gap-3 transition-all duration-[400ms]">
												<div className="pointer-events-none w-max shrink-0 rounded-lg bg-bg-weak-50 px-2.5 py-1 text-text-soft-400 ring-1 ring-stroke-soft-200/50">
													<span>email@</span>
												</div>
												<input
													className="w-full flex-1 bg-transparent text-text-strong-950 outline-none placeholder:text-text-soft-400"
													placeholder="example.com"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															handleVerify();
														}
													}}
												/>
											</div>
										</label>

										{/* Action Row */}
										<div className="flex flex-wrap items-center justify-between gap-2 border-stroke-soft-200/50 border-t p-3">
											<div className="flex items-center gap-2">
												<button
													type="button"
													onClick={() => {
														setEmail("");
														setCurrentResult(null);
													}}
													className="flex h-8 w-8 items-center justify-center rounded-lg text-text-sub-600 ring-1 ring-stroke-soft-200/50 transition-all duration-200 hover:bg-bg-weak-50 active:scale-[0.99]"
													aria-label="Clear"
												>
													<Icon name="trash" className="h-5 w-5" />
												</button>
											</div>

											<div className="flex items-center gap-2">
												<button
													type="button"
													onClick={handleGetCode}
													className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-text-sub-600 ring-1 ring-stroke-soft-200/50 transition-all duration-200 hover:bg-bg-weak-50 active:scale-[0.99]"
												>
													<Icon name="code" className="h-5 w-5" />
													<span className="label-sm">Get code</span>
												</button>
												<button
													type="button"
													onClick={handleVerify}
													disabled={isVerifying}
													className="flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary-base px-3 text-static-white transition-all duration-200 hover:bg-primary-darker active:scale-[0.995] disabled:opacity-50"
												>
													{isVerifying ? (
														<>
															<Icon
																name="loader"
																className="h-4 w-4 animate-spin"
															/>
															<span className="label-sm">Verifying...</span>
														</>
													) : (
														<span className="label-sm">Start verification</span>
													)}
												</button>
											</div>
										</div>
									</>
								) : (
									<>
										{/* Bulk CSV Upload - Drag & Drop */}
										<div className="p-4">
											{/* Hidden file input */}
											<input
												ref={fileInputRef}
												type="file"
												accept=".csv"
												className="hidden"
												onChange={handleFileSelect}
											/>

											{/* Drop zone */}
											<div
												onDragOver={handleDragOver}
												onDragLeave={handleDragLeave}
												onDrop={handleDrop}
												onClick={handleBrowseClick}
												className={cn(
													"flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 transition-all duration-200",
													isDragging
														? "border-primary-base bg-primary-alpha-10"
														: "border-stroke-soft-200/50 hover:border-primary-base hover:bg-bg-weak-50",
													csvFile && "border-success-base bg-success-alpha-10",
												)}
											>
												<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-bg-weak-50 text-text-sub-600">
													<Icon name="upload" className="h-6 w-6" />
												</div>
												<div className="text-center">
													<p className="font-medium text-text-strong-950">
														{csvFile ? csvFile.name : "Import CSV File"}
													</p>
													<p className="mt-1 text-sm text-text-soft-400">
														{csvFile
															? `${(csvFile.size / 1024).toFixed(1)} KB`
															: "Drop file or click here to choose file."}
													</p>
												</div>
											</div>

											{/* Progress bar during bulk verify */}
											{bulkProgress && (
												<div className="mt-4">
													<div className="mb-2 flex items-center justify-between text-sm">
														<span className="text-text-sub-600">
															{bulkProgress.status === "completed"
																? "Completed"
																: "Processing..."}
														</span>
														<span className="text-text-strong-950">
															{bulkProgress.progress}%
														</span>
													</div>
													<div className="h-2 w-full overflow-hidden rounded-full bg-bg-weak-50">
														<motion.div
															className="h-full bg-primary-base"
															initial={{ width: 0 }}
															animate={{ width: `${bulkProgress.progress}%` }}
															transition={{ duration: 0.3 }}
														/>
													</div>
													<p className="mt-2 text-center text-text-soft-400 text-xs">
														Processed{" "}
														{Math.round(
															(bulkProgress.progress / 100) *
																bulkProgress.total,
														)}{" "}
														of {bulkProgress.total} emails
													</p>
												</div>
											)}
										</div>

										{/* Action Row */}
										<div className="flex items-center justify-end gap-2 border-stroke-soft-200/50 border-t p-3">
											<button
												type="button"
												onClick={handleGetCode}
												className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-text-sub-600 ring-1 ring-stroke-soft-200/50 transition-all duration-200 hover:bg-bg-weak-50 active:scale-[0.99]"
											>
												<Icon name="code" className="h-5 w-5" />
												<span className="label-sm">Get code</span>
											</button>
											<button
												type="button"
												onClick={handleBulkVerify}
												disabled={isVerifying || !csvFile}
												className="flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary-base px-4 text-static-white transition-all duration-200 hover:bg-primary-darker active:scale-[0.995] disabled:opacity-50"
											>
												{isVerifying ? (
													<>
														<Icon
															name="loader"
															className="h-4 w-4 animate-spin"
														/>
														<span className="label-sm">Processing...</span>
													</>
												) : (
													<span className="label-sm">Start bulk verify</span>
												)}
											</button>
										</div>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Verification Result Section */}
			<AnimatePresence mode="wait">
				{currentResult && (
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
														currentResult.state === "deliverable"
															? "bg-success-alpha-10"
															: currentResult.state === "risky"
																? "bg-warning-alpha-10"
																: "bg-error-alpha-10",
													)}
												>
													<Icon
														name={
															currentResult.state === "deliverable"
																? "check-circle"
																: currentResult.state === "risky"
																	? "alert-triangle"
																	: "x-circle"
														}
														className={cn(
															"h-5 w-5",
															currentResult.state === "deliverable"
																? "text-success-base"
																: currentResult.state === "risky"
																	? "text-warning-base"
																	: "text-error-base",
														)}
													/>
												</div>
												<div>
													<p className="font-medium font-mono text-text-strong-950">
														{currentResult.email}
													</p>
													<div className="mt-0.5 flex items-center gap-2">
														<span
															className={cn(
																"rounded-full px-2 py-0.5 font-medium text-xs",
																getStateBadge(currentResult.state),
															)}
														>
															{currentResult.state.charAt(0).toUpperCase() +
																currentResult.state.slice(1)}
														</span>
														<span className="text-text-soft-400 text-xs">
															{currentResult.reason.replace(/_/g, " ")}
														</span>
													</div>
												</div>
											</div>
											<div className="text-right">
												<p
													className={cn(
														"font-bold text-3xl",
														getScoreColor(currentResult.score),
													)}
												>
													{currentResult.score}
												</p>
												<p className="text-text-soft-400 text-xs">
													Quality Score
												</p>
											</div>
										</div>

										{/* Checks Grid */}
										<div className="grid grid-cols-3 gap-px bg-stroke-soft-200/50">
											{/* Syntax Check */}
											<div className="bg-bg-white-0 p-3">
												<div className="flex items-center gap-2">
													<Icon
														name={
															currentResult.checks.syntax.valid ? "check" : "x"
														}
														className={cn(
															"h-4 w-4",
															currentResult.checks.syntax.valid
																? "text-success-base"
																: "text-error-base",
														)}
													/>
													<span className="text-sm text-text-sub-600">
														Syntax Valid
													</span>
												</div>
											</div>

											{/* MX Records */}
											<div className="bg-bg-white-0 p-3">
												<div className="flex items-center gap-2">
													<Icon
														name={
															currentResult.checks.dns.hasMx ? "check" : "x"
														}
														className={cn(
															"h-4 w-4",
															currentResult.checks.dns.hasMx
																? "text-success-base"
																: "text-error-base",
														)}
													/>
													<span className="text-sm text-text-sub-600">
														MX Records
													</span>
												</div>
											</div>

											{/* Domain Exists */}
											<div className="bg-bg-white-0 p-3">
												<div className="flex items-center gap-2">
													<Icon
														name={
															currentResult.checks.dns.domainExists
																? "check"
																: "x"
														}
														className={cn(
															"h-4 w-4",
															currentResult.checks.dns.domainExists
																? "text-success-base"
																: "text-error-base",
														)}
													/>
													<span className="text-sm text-text-sub-600">
														Domain Exists
													</span>
												</div>
											</div>

											{/* Disposable */}
											<div className="bg-bg-white-0 p-3">
												<div className="flex items-center gap-2">
													<Icon
														name={
															currentResult.checks.disposable.isDisposable
																? "alert-triangle"
																: "check"
														}
														className={cn(
															"h-4 w-4",
															currentResult.checks.disposable.isDisposable
																? "text-warning-base"
																: "text-success-base",
														)}
													/>
													<span className="text-sm text-text-sub-600">
														{currentResult.checks.disposable.isDisposable
															? "Disposable"
															: "Not Disposable"}
													</span>
												</div>
											</div>

											{/* Role-based */}
											<div className="bg-bg-white-0 p-3">
												<div className="flex items-center gap-2">
													<Icon
														name={
															currentResult.checks.role.isRole
																? "alert-triangle"
																: "check"
														}
														className={cn(
															"h-4 w-4",
															currentResult.checks.role.isRole
																? "text-warning-base"
																: "text-success-base",
														)}
													/>
													<span className="text-sm text-text-sub-600">
														{currentResult.checks.role.isRole
															? `Role (${currentResult.checks.role.role})`
															: "Personal Email"}
													</span>
												</div>
											</div>

											{/* Free Provider */}
											<div className="bg-bg-white-0 p-3">
												<div className="flex items-center gap-2">
													<Icon
														name="info"
														className="h-4 w-4 text-text-soft-400"
													/>
													<span className="text-sm text-text-sub-600">
														{currentResult.checks.freeProvider.isFree
															? currentResult.checks.freeProvider.provider
															: "Business Email"}
													</span>
												</div>
											</div>
										</div>

										{/* Analytics Section */}
										<div className="border-stroke-soft-200/50 border-t p-4">
											<div className="flex flex-wrap gap-4 text-sm">
												<div>
													<span className="text-text-soft-400">
														Risk Level:
													</span>
													<span
														className={cn(
															"ml-2 font-medium",
															currentResult.analytics.riskLevel === "low"
																? "text-success-base"
																: currentResult.analytics.riskLevel === "medium"
																	? "text-warning-base"
																	: "text-error-base",
														)}
													>
														{currentResult.analytics.riskLevel.toUpperCase()}
													</span>
												</div>
												{currentResult.analytics.smtpProvider && (
													<div>
														<span className="text-text-soft-400">
															Provider:
														</span>
														<span className="ml-2 text-text-strong-950">
															{currentResult.analytics.smtpProvider}
														</span>
													</div>
												)}
												<div>
													<span className="text-text-soft-400">
														Verified in:
													</span>
													<span className="ml-2 text-text-strong-950">
														{currentResult.duration}ms
													</span>
												</div>
											</div>

											{/* Did you mean? */}
											{currentResult.analytics.didYouMean && (
												<div className="mt-3 flex items-center gap-2 rounded-lg bg-primary-alpha-10 p-3">
													<Icon
														name="lightbulb"
														className="h-4 w-4 text-primary-base"
													/>
													<span className="text-primary-darker text-sm">
														Did you mean:{" "}
														<button
															type="button"
															onClick={() => {
																setEmail(currentResult.analytics.didYouMean!);
																setCurrentResult(null);
															}}
															className="font-medium underline"
														>
															{currentResult.analytics.didYouMean}
														</button>
														?
													</span>
												</div>
											)}

											{/* Warnings */}
											{currentResult.analytics.warnings.length > 0 && (
												<div className="mt-3 flex flex-wrap gap-2">
													{currentResult.analytics.warnings.map((warning) => (
														<span
															key={warning}
															className="rounded-full bg-warning-alpha-10 px-2 py-0.5 text-warning-base text-xs"
														>
															{warning.replace(/_/g, " ")}
														</span>
													))}
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Bulk Results Section - Only show on Bulk tab */}
			{activeTab === "bulk" &&
				bulkResults &&
				bulkResults.results.length > 0 &&
				(() => {
					// Filter results by search
					const filteredResults = bulkResults.results.filter((result) =>
						result.email
							.toLowerCase()
							.includes(bulkResultsSearch.toLowerCase()),
					);
					// Paginate filtered results
					const totalPages = Math.ceil(
						filteredResults.length / bulkResultsPageSize,
					);
					const paginatedResults = filteredResults.slice(
						(bulkResultsPage - 1) * bulkResultsPageSize,
						bulkResultsPage * bulkResultsPageSize,
					);
					const startIndex = (bulkResultsPage - 1) * bulkResultsPageSize + 1;
					const endIndex = Math.min(
						bulkResultsPage * bulkResultsPageSize,
						filteredResults.length,
					);

					return (
						<div className="border-stroke-soft-200/50 border-b">
							<div className="px-52 2xl:px-[350px]">
								<div className="border-stroke-soft-200/50 border-r border-l">
									<div className="mx-auto max-w-4xl px-6 py-6">
										{/* Header with title, inline stats, search and close */}
										<div className="mb-6 flex items-center justify-between">
											<div className="flex items-center gap-6">
												<h3 className="font-semibold text-lg text-text-strong-950">
													Verification Results
												</h3>
												{/* Inline Stats */}
												{bulkResults.stats && (
													<div className="flex items-center gap-4 text-sm">
														<span className="text-text-sub-600">
															<span className="font-medium text-text-strong-950">
																{bulkResults.stats.total}
															</span>{" "}
															total
														</span>
														<span className="text-text-disabled-300">•</span>
														<span className="text-success-base">
															{bulkResults.stats.deliverable} valid
														</span>
														<span className="text-text-disabled-300">•</span>
														<span className="text-warning-base">
															{bulkResults.stats.risky} risky
														</span>
														<span className="text-text-disabled-300">•</span>
														<span className="text-error-base">
															{bulkResults.stats.undeliverable} invalid
														</span>
													</div>
												)}
											</div>
											<div className="flex items-center gap-3">
												{/* Search */}
												<div className="w-52">
													<Input.Root size="small" className="rounded-lg">
														<Input.Wrapper>
															<Input.Icon
																as={() => (
																	<Icon name="search" className="h-4 w-4" />
																)}
															/>
															<Input.Input
																type="text"
																placeholder="Search..."
																value={bulkResultsSearch}
																onChange={(e) => {
																	setBulkResultsSearch(e.target.value);
																	setBulkResultsPage(1);
																}}
															/>
														</Input.Wrapper>
													</Input.Root>
												</div>
												{/* Close button */}
												<button
													type="button"
													onClick={() => setBulkResults(null)}
													className="flex h-8 w-8 items-center justify-center rounded-lg text-text-soft-400 transition-colors hover:bg-bg-weak-50 hover:text-text-sub-600"
												>
													<Icon name="x" className="h-4 w-4" />
												</button>
											</div>
										</div>

										{/* Results Table - Minimal */}
										<div className="overflow-hidden rounded-lg border border-stroke-soft-200/50">
											<table className="w-full">
												<thead>
													<tr className="border-stroke-soft-200/50 border-b bg-bg-weak-50/50">
														<th className="px-4 py-2.5 text-left font-medium text-text-sub-600 text-xs uppercase tracking-wide">
															Email
														</th>
														<th className="px-4 py-2.5 text-center font-medium text-text-sub-600 text-xs uppercase tracking-wide">
															Status
														</th>
														<th className="px-4 py-2.5 text-center font-medium text-text-sub-600 text-xs uppercase tracking-wide">
															Score
														</th>
														<th className="px-4 py-2.5 text-left font-medium text-text-sub-600 text-xs uppercase tracking-wide">
															Reason
														</th>
													</tr>
												</thead>
												<tbody>
													{paginatedResults.length > 0 ? (
														paginatedResults.map((result, index) => (
															<tr
																key={`${result.email}-${index}`}
																className="border-stroke-soft-200/50 border-b transition-colors last:border-b-0 hover:bg-bg-weak-50/30"
															>
																<td className="px-4 py-3">
																	<span className="font-mono text-sm text-text-strong-950">
																		{result.email}
																	</span>
																</td>
																<td className="px-4 py-3 text-center">
																	<span
																		className={cn(
																			"inline-flex items-center gap-1 text-sm",
																			result.state === "deliverable"
																				? "text-success-base"
																				: result.state === "risky"
																					? "text-warning-base"
																					: "text-error-base",
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
																			className="h-3.5 w-3.5"
																		/>
																		{result.state}
																	</span>
																</td>
																<td className="px-4 py-3 text-center">
																	<span
																		className={cn(
																			"font-medium text-sm",
																			getScoreColor(result.score),
																		)}
																	>
																		{result.score}
																	</span>
																</td>
																<td className="px-4 py-3">
																	<span className="text-sm text-text-sub-600">
																		{result.reason.replace(/_/g, " ")}
																	</span>
																</td>
															</tr>
														))
													) : (
														<tr>
															<td
																colSpan={4}
																className="px-4 py-8 text-center text-sm text-text-soft-400"
															>
																No results found for "{bulkResultsSearch}"
															</td>
														</tr>
													)}
												</tbody>
											</table>
										</div>

										{/* Pagination Footer - Minimal */}
										{filteredResults.length > 0 && (
											<div className="mt-4 flex items-center justify-between text-sm">
												<div className="flex items-center gap-2 text-text-sub-600">
													<span>
														{startIndex}–{endIndex} of {filteredResults.length}
													</span>
													<PageSizeDropdown
														value={bulkResultsPageSize}
														onValueChange={(value) => {
															setBulkResultsPageSize(value);
															setBulkResultsPage(1);
														}}
													/>
												</div>
												<PaginationControls
													currentPage={bulkResultsPage}
													totalPages={totalPages}
													onPageChange={setBulkResultsPage}
												/>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					);
				})()}

			{/* Past Bulk Jobs Section - Only show on Bulk tab */}
			{activeTab === "bulk" && (
				<div className="border-stroke-soft-200/50 border-b">
					<div className="px-52 2xl:px-[350px]">
						<div className="border-stroke-soft-200/50 border-r border-l">
							<div className="mx-auto max-w-4xl px-6 py-6">
								<h2 className="mb-4 font-semibold text-lg text-text-strong-950">
									Past Bulk Jobs
								</h2>

								{isLoadingBulkJobs ? (
									<div className="flex items-center justify-center py-8">
										<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-base border-t-transparent" />
									</div>
								) : pastBulkJobs.length === 0 ? (
									<div className="flex flex-col items-center justify-center rounded-lg border border-stroke-soft-200/50 border-dashed py-12">
										<Icon
											name="folder"
											className="mb-3 h-8 w-8 text-text-disabled-300"
										/>
										<p className="text-sm text-text-sub-600">
											No bulk jobs yet
										</p>
										<p className="text-text-soft-400 text-xs">
											Upload a CSV to start bulk verification
										</p>
									</div>
								) : (
									<div className="grid gap-3">
										{pastBulkJobs.map((job) => (
											<button
												key={job.id}
												type="button"
												onClick={() => push(`/playground/bulk/${job.id}`)}
												className="group overflow-hidden rounded-lg border border-stroke-soft-200/50 bg-bg-white-0 text-left transition-all hover:border-stroke-soft-200 hover:shadow-sm"
											>
												<div className="flex items-stretch">
													{/* Left section - Job info */}
													<div className="flex-1 p-4">
														<div className="flex items-start justify-between">
															<div>
																<p className="font-medium text-sm text-text-strong-950 group-hover:text-primary-base">
																	{job.name || "Bulk Verification"}
																</p>
																<p className="mt-0.5 text-text-soft-400 text-xs">
																	{job.totalEmails} emails •{" "}
																	{new Date(job.createdAt).toLocaleDateString(
																		"en-US",
																		{
																			month: "short",
																			day: "numeric",
																			year: "numeric",
																		},
																	)}
																</p>
															</div>
															{job.status === "completed" ? (
																<Icon
																	name="check-circle"
																	className="h-4 w-4 text-text-disabled-300"
																/>
															) : job.status === "processing" ? (
																<Icon
																	name="loader"
																	className="h-4 w-4 animate-spin text-warning-base"
																/>
															) : job.status === "failed" ? (
																<Icon
																	name="x-circle"
																	className="h-4 w-4 text-error-base"
																/>
															) : (
																<Icon
																	name="clock"
																	className="h-4 w-4 text-text-soft-400"
																/>
															)}
														</div>

														{/* Stats row */}
														{job.status === "completed" && job.stats && (
															<div className="mt-3 flex items-center gap-4">
																<div className="flex items-center gap-1.5">
																	<div className="h-2 w-2 rounded-full bg-success-base" />
																	<span className="text-text-sub-600 text-xs">
																		{job.stats.deliverable} valid
																	</span>
																</div>
																<div className="flex items-center gap-1.5">
																	<div className="h-2 w-2 rounded-full bg-warning-base" />
																	<span className="text-text-sub-600 text-xs">
																		{job.stats.risky} risky
																	</span>
																</div>
																<div className="flex items-center gap-1.5">
																	<div className="h-2 w-2 rounded-full bg-error-base" />
																	<span className="text-text-sub-600 text-xs">
																		{job.stats.undeliverable} invalid
																	</span>
																</div>
															</div>
														)}
													</div>

													{/* Right section - Arrow indicator */}
													<div className="flex w-10 items-center justify-center border-stroke-soft-200/50 border-l bg-bg-weak-50/50 transition-colors group-hover:bg-bg-weak-50">
														<Icon
															name="chevron-right"
															className="h-4 w-4 text-text-soft-400 transition-transform group-hover:translate-x-0.5 group-hover:text-text-sub-600"
														/>
													</div>
												</div>
											</button>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Recent Runs Section - Only show on Single tab */}
			{activeTab === "single" && (
				<div className="border-stroke-soft-200/50 border-b">
					<div className="px-[340px] 2xl:px-[450px]">
						<div className="border-stroke-soft-200/50 border-r border-l">
							{/* Section Header */}
							<div className="border-stroke-soft-200/50 border-b px-6 py-4">
								<h2 className="font-semibold text-lg text-text-strong-950">
									Recent Verifications
								</h2>
							</div>

							{/* Table-like content */}
							<div>
								{recentRuns.length === 0 ? (
									<div className="flex flex-col items-center justify-center px-6 py-12">
										<Icon
											name="mail"
											className="mb-3 h-8 w-8 text-text-disabled-300"
										/>
										<p className="text-text-sub-600">No verifications yet</p>
										<p className="text-[13px] text-text-soft-400">
											Enter an email above to start verifying
										</p>
									</div>
								) : (
									recentRuns.map((run) => (
										<button
											key={run.id}
											type="button"
											onClick={() => {
												push(`/playground/verify/${run.id}`); // Navigate to detail
											}}
											className="flex w-full items-center justify-between border-stroke-soft-200/50 border-b px-6 py-4 text-left transition-colors last:border-b-0 hover:bg-bg-weak-50"
										>
											<div className="flex items-center gap-3">
												{(() => {
													const ProviderIcon = getProviderIcon(run.email);
													if (ProviderIcon) {
														return <ProviderIcon className="h-5 w-5" />;
													}
													return (
														<Icon
															name={
																run.result.state === "deliverable"
																	? "check-circle"
																	: run.result.state === "risky"
																		? "alert-triangle"
																		: "x-circle"
															}
															className={cn(
																"h-5 w-5",
																run.result.state === "deliverable"
																	? "text-success-base"
																	: run.result.state === "risky"
																		? "text-warning-base"
																		: "text-error-base",
															)}
														/>
													);
												})()}
												<span className="font-mono text-sm text-text-strong-950">
													{run.email}
												</span>
											</div>

											<div className="flex items-center gap-4">
												<span
													className={cn(
														"font-semibold text-sm",
														getScoreColor(run.result.score),
													)}
												>
													{run.result.score}
												</span>
												<span
													className={cn(
														"min-w-[90px] text-sm",
														run.result.state === "deliverable"
															? "text-success-base"
															: run.result.state === "risky"
																? "text-warning-base"
																: "text-error-base",
													)}
												>
													{run.result.state}
												</span>
												{run.result.duration && (
													<span className="text-sm text-text-soft-400">
														{run.result.duration}ms
													</span>
												)}
											</div>
										</button>
									))
								)}
							</div>

							{/* Pagination */}
							{historyTotalPages > 1 && (
								<div className="mt-4 flex items-center justify-center gap-2">
									<button
										type="button"
										onClick={() => fetchHistory(historyPage - 1)}
										disabled={historyPage <= 1 || isLoadingHistory}
										className="rounded-lg border border-stroke-soft-200/50 px-3 py-1.5 text-sm text-text-sub-600 hover:bg-bg-weak-50 disabled:cursor-not-allowed disabled:opacity-50"
									>
										Previous
									</button>
									<span className="text-sm text-text-soft-400">
										Page {historyPage} of {historyTotalPages}
									</span>
									<button
										type="button"
										onClick={() => fetchHistory(historyPage + 1)}
										disabled={
											historyPage >= historyTotalPages || isLoadingHistory
										}
										className="rounded-lg border border-stroke-soft-200/50 px-3 py-1.5 text-sm text-text-sub-600 hover:bg-bg-weak-50 disabled:cursor-not-allowed disabled:opacity-50"
									>
										Next
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PlaygroundPage;
