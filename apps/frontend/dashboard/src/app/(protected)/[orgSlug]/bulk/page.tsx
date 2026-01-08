"use client";

import { PageSizeDropdown } from "@fe/dashboard/components/page-size-dropdown";
import { PaginationControls } from "@fe/dashboard/components/pagination-controls";
import { useSidebar } from "@fe/dashboard/providers/sidebar-provider";
import { getProviderIcon } from "@fe/dashboard/utils/email-provider-icon";
import { cn } from "@verifio/ui/cn";
import * as FileFormatIcon from "@verifio/ui/file-format-icon";
import { Icon } from "@verifio/ui/icon";
import * as Input from "@verifio/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
	BulkResultsFilterDropdown,
	type BulkResultsFilters,
} from "./components/bulk-results-filter-dropdown";
import {
	EmailDetailModal,
	type EmailVerificationData,
} from "./components/email-detail-modal";

interface VerificationResult {
	email: string;
	state: "deliverable" | "undeliverable" | "risky" | "unknown";
	score: number;
	reason: string;
	duration?: number;
	// The API returns full verification data nested in a 'result' field
	result?: EmailVerificationData["result"];
}

interface BulkJob {
	id: string;
	name: string | null;
	status: "pending" | "processing" | "completed" | "failed";
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
}

interface BulkStats {
	totalVerified: number;
	deliverableRate: number;
	averageScore: number;
	jobsCompleted: number;
}

const BulkPage = () => {
	const { isCollapsed } = useSidebar();
	const fileInputRef = useRef<HTMLInputElement>(null);

	// State
	const [csvFile, setCsvFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isVerifying, setIsVerifying] = useState(false);
	const [jobs, setJobs] = useState<BulkJob[]>([]);
	const [isLoadingJobs, setIsLoadingJobs] = useState(true);
	const [stats, setStats] = useState<BulkStats | null>(null);
	const [activeJob, setActiveJob] = useState<{
		jobId: string;
		status: string;
		progress: number;
		total: number;
	} | null>(null);

	// Expanded job details
	const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
	const [jobResults, setJobResults] = useState<VerificationResult[]>([]);
	const [isLoadingResults, setIsLoadingResults] = useState(false);
	const [resultsSearch, setResultsSearch] = useState("");
	const [resultsPage, setResultsPage] = useState(1);
	const resultsPageSize = 10;
	const [resultsFilter, setResultsFilter] = useState<BulkResultsFilters>({
		states: [],
	});

	// Selected email for detail modal
	const [selectedEmail, setSelectedEmail] = useState<VerificationResult | null>(
		null,
	);

	// Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	// Fetch bulk jobs
	const fetchJobs = useCallback(
		async (page = 1) => {
			setIsLoadingJobs(true);
			try {
				const response = await fetch(
					`/api/verify/v1/jobs?page=${page}&limit=${pageSize}`,
					{
						credentials: "include",
					},
				);
				const data = await response.json();

				if (data.success && data.data?.jobs) {
					setJobs(data.data.jobs);
					setCurrentPage(data.data.pagination?.page ?? 1);
					setTotalPages(data.data.pagination?.totalPages ?? 1);

					// Calculate stats from jobs
					const completedJobs = data.data.jobs.filter(
						(j: BulkJob) => j.status === "completed",
					);
					let totalVerified = 0;
					let totalDeliverable = 0;
					let totalScore = 0;
					let scoreCount = 0;

					for (const job of completedJobs) {
						totalVerified += job.totalEmails;
						if (job.stats) {
							totalDeliverable += job.stats.deliverable;
							if (job.stats.averageScore) {
								totalScore += job.stats.averageScore;
								scoreCount++;
							}
						}
					}

					setStats({
						totalVerified,
						deliverableRate:
							totalVerified > 0
								? Math.round((totalDeliverable / totalVerified) * 100)
								: 0,
						averageScore:
							scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0,
						jobsCompleted: completedJobs.length,
					});
				}
			} catch (error) {
				console.error("Failed to fetch jobs:", error);
			} finally {
				setIsLoadingJobs(false);
			}
		},
		[pageSize],
	);

	// Fetch job results
	const fetchJobResults = async (jobId: string) => {
		setIsLoadingResults(true);
		try {
			const response = await fetch(
				`/api/verify/v1/bulk-jobs/${jobId}/results`,
				{
					credentials: "include",
				},
			);
			const data = await response.json();

			if (data.success && data.data?.results) {
				setJobResults(data.data.results);
			}
		} catch (error) {
			console.error("Failed to fetch job results:", error);
			toast.error("Failed to load job results");
		} finally {
			setIsLoadingResults(false);
		}
	};

	// Toggle job expansion
	const toggleJobExpansion = async (jobId: string) => {
		if (expandedJobId === jobId) {
			setExpandedJobId(null);
			setJobResults([]);
			setResultsSearch("");
			setResultsPage(1);
		} else {
			setExpandedJobId(jobId);
			await fetchJobResults(jobId);
		}
	};

	// Download results as CSV
	const downloadResultsCSV = (job: BulkJob, results: VerificationResult[]) => {
		const headers = ["Email", "Status", "Score", "Reason"];
		const rows = results.map((r) => [
			r.email,
			r.state,
			r.score.toString(),
			r.reason,
		]);

		const csvContent = [
			headers.join(","),
			...rows.map((row) =>
				row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","),
			),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${job.name || `bulk-results-${job.id.slice(0, 8)}`}.csv`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		toast.success("Results downloaded successfully");
	};

	// Fetch jobs on mount
	useEffect(() => {
		fetchJobs();
	}, [fetchJobs]);

	// File handling
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
		if (file && (file.type === "text/csv" || file.name.endsWith(".csv"))) {
			setCsvFile(file);
			toast.success(`File "${file.name}" ready for upload`);
		} else {
			toast.error("Please upload a CSV file");
		}
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && (file.type === "text/csv" || file.name.endsWith(".csv"))) {
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

	const handleStartVerification = async () => {
		if (!csvFile) {
			toast.error("Please upload a CSV file first");
			return;
		}

		setIsVerifying(true);

		try {
			const emails = await parseCSV(csvFile);

			if (emails.length === 0) {
				toast.error("No valid emails found in CSV");
				setIsVerifying(false);
				return;
			}

			toast.info(`Found ${emails.length} emails. Starting verification...`);

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
				setActiveJob({
					jobId,
					status: "processing",
					progress: 0,
					total: emails.length,
				});

				// Poll for status
				const pollStatus = async () => {
					const statusRes = await fetch(`/api/verify/v1/bulk-jobs/${jobId}`, {
						credentials: "include",
					});
					const statusData = await statusRes.json();

					if (statusData.success && statusData.data) {
						const job = statusData.data;
						setActiveJob({
							jobId,
							status: job.status,
							progress: job.progress,
							total: job.total,
						});

						if (job.status === "completed") {
							toast.success(
								`Bulk verification completed! ${job.stats?.deliverable || 0} deliverable.`,
							);
							setIsVerifying(false);
							setActiveJob(null);
							setCsvFile(null);
							fetchJobs(); // Refresh jobs list
						} else if (job.status === "failed") {
							toast.error("Bulk verification failed");
							setIsVerifying(false);
							setActiveJob(null);
						} else {
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

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "completed":
				return (
					<span className="inline-flex items-center gap-1 rounded-full bg-success-alpha-10 px-2 py-0.5 font-medium text-success-base text-xs">
						<div className="h-1.5 w-1.5 rounded-full bg-success-base" />
						Completed
					</span>
				);
			case "processing":
				return (
					<span className="inline-flex items-center gap-1 rounded-full bg-warning-alpha-10 px-2 py-0.5 font-medium text-warning-base text-xs">
						<Icon name="loader" className="h-3 w-3 animate-spin" />
						Processing
					</span>
				);
			case "failed":
				return (
					<span className="inline-flex items-center gap-1 rounded-full bg-error-alpha-10 px-2 py-0.5 font-medium text-error-base text-xs">
						<div className="h-1.5 w-1.5 rounded-full bg-error-base" />
						Failed
					</span>
				);
			default:
				return (
					<span className="inline-flex items-center gap-1 rounded-full bg-bg-weak-50 px-2 py-0.5 font-medium text-text-sub-600 text-xs">
						<div className="h-1.5 w-1.5 rounded-full bg-text-sub-600" />
						Pending
					</span>
				);
		}
	};

	const getScoreColor = (score: number) => {
		if (score >= 90) return "text-success-base";
		if (score >= 70) return "text-primary-base";
		if (score >= 50) return "text-warning-base";
		return "text-error-base";
	};

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

	// Filter and paginate results
	const filteredResults = jobResults.filter((r) => {
		const matchesSearch = r.email
			.toLowerCase()
			.includes(resultsSearch.toLowerCase());
		const matchesState =
			resultsFilter.states.length === 0 ||
			resultsFilter.states.includes(r.state);
		return matchesSearch && matchesState;
	});
	const resultsTotalPages = Math.ceil(filteredResults.length / resultsPageSize);
	const paginatedResults = filteredResults.slice(
		(resultsPage - 1) * resultsPageSize,
		resultsPage * resultsPageSize,
	);

	return (
		<>
			<div className="flex h-full flex-col overflow-hidden">
				{/* Header Section - Full width horizontal border */}
				<div className="border-stroke-soft-200/50 border-b">
					<div
						className={cn(isCollapsed ? "px-24 2xl:px-32" : "px-6 2xl:px-32")}
					>
						<div className="relative border-stroke-soft-200/50 border-r border-l">
							<div className="px-6 py-8">
								<h1 className="mb-2 font-medium text-2xl text-text-strong-950">
									Bulk Verification
								</h1>
								<p className="text-paragraph-md text-text-sub-600">
									Upload and verify large email lists efficiently
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Content Area with vertical borders */}
				<div className="flex-1">
					<div
						className={cn(isCollapsed ? "px-24 2xl:px-32" : "px-6 2xl:px-32")}
					>
						<div className="flex flex-col border-stroke-soft-200/50 border-r border-l">
							{/* Stats Grid */}
							<div className="border-stroke-soft-200/50">
								<div className="grid grid-cols-4">
									{/* Total Verified */}
									<div className="border-stroke-soft-200/50 border-r px-6 py-5">
										<div className="flex items-start justify-between">
											<div>
												<p className="mb-1 text-text-sub-600 text-xs uppercase tracking-wider">
													Total Verified
												</p>
												{isLoadingJobs ? (
													<div className="h-8 w-20 animate-pulse rounded bg-bg-weak-100" />
												) : (
													<p className="font-semibold text-2xl text-text-strong-950">
														{stats?.totalVerified.toLocaleString() ?? 0}
													</p>
												)}
											</div>
											<Icon
												name="mail"
												className="h-4 w-4 text-text-soft-400"
											/>
										</div>
									</div>

									{/* Deliverability Rate */}
									<div className="border-stroke-soft-200/50 border-r px-6 py-5">
										<div className="flex items-start justify-between">
											<div>
												<p className="mb-1 text-text-sub-600 text-xs uppercase tracking-wider">
													Deliverability
												</p>
												{isLoadingJobs ? (
													<div className="h-8 w-16 animate-pulse rounded bg-bg-weak-100" />
												) : (
													<p className="font-semibold text-2xl text-text-strong-950">
														{stats?.deliverableRate ?? 0}
														<span className="ml-0.5 font-normal text-lg text-text-sub-600">
															%
														</span>
													</p>
												)}
											</div>
											<Icon
												name="check-circle"
												className="h-4 w-4 text-text-soft-400"
											/>
										</div>
									</div>

									{/* Average Score */}
									<div className="border-stroke-soft-200/50 border-r px-6 py-5">
										<div className="flex items-start justify-between">
											<div>
												<p className="mb-1 text-text-sub-600 text-xs uppercase tracking-wider">
													Avg. Score
												</p>
												{isLoadingJobs ? (
													<div className="h-8 w-14 animate-pulse rounded bg-bg-weak-100" />
												) : (
													<p className="font-semibold text-2xl text-text-strong-950">
														{stats?.averageScore ?? 0}
														<span className="ml-0.5 font-normal text-lg text-text-sub-600">
															/100
														</span>
													</p>
												)}
											</div>
											<Icon
												name="activity"
												className="h-4 w-4 text-text-soft-400"
											/>
										</div>
									</div>

									{/* Jobs Completed */}
									<div className="px-6 py-5">
										<div className="flex items-start justify-between">
											<div>
												<p className="mb-1 text-text-sub-600 text-xs uppercase tracking-wider">
													Jobs Completed
												</p>
												{isLoadingJobs ? (
													<div className="h-8 w-12 animate-pulse rounded bg-bg-weak-100" />
												) : (
													<p className="font-semibold text-2xl text-text-strong-950">
														{stats?.jobsCompleted ?? 0}
													</p>
												)}
											</div>
											<Icon
												name="layers"
												className="h-4 w-4 text-text-soft-400"
											/>
										</div>
									</div>
								</div>
							</div>

							{/* File Upload Section */}
							<div className="border-stroke-soft-200/50">
								<div className="relative flex items-center gap-2 px-6 py-4">
									<Icon name="upload" className="h-4 w-4 text-text-sub-600" />
									<h3 className="font-medium text-label-md text-text-strong-950">
										Upload Email List
									</h3>
									{/* Top border extending to edges */}
									<div className="absolute top-0 right-[-100vw] left-[-100vw] h-px bg-stroke-soft-200/50" />
								</div>

								<div className="px-6 pb-6">
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
											"flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed p-8 transition-all duration-200",
											isDragging
												? "border-primary-base bg-primary-alpha-10"
												: "border-stroke-soft-200/50 hover:border-primary-base hover:bg-bg-weak-50",
											csvFile && "border-success-base bg-success-alpha-10",
										)}
									>
										<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-bg-weak-50">
											<FileFormatIcon.Root
												format="CSV"
												color="green"
												className="h-7 w-7"
											/>
										</div>
										<div className="text-center">
											<p className="font-medium text-text-strong-950">
												{csvFile ? csvFile.name : "Import CSV File"}
											</p>
											<p className="mt-1 text-sm text-text-soft-400">
												{csvFile
													? `${(csvFile.size / 1024).toFixed(1)} KB`
													: "Drop file or click here to choose file"}
											</p>
										</div>
									</div>

									{/* Active job progress */}
									<AnimatePresence>
										{activeJob && (
											<motion.div
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: "auto" }}
												exit={{ opacity: 0, height: 0 }}
												className="mt-4"
											>
												<div className="mb-2 flex items-center justify-between text-sm">
													<span className="text-text-sub-600">
														{activeJob.status === "completed"
															? "Completed"
															: "Processing..."}
													</span>
													<span className="text-text-strong-950">
														{activeJob.progress}%
													</span>
												</div>
												<div className="h-2 w-full overflow-hidden rounded-full bg-bg-weak-50">
													<motion.div
														className="h-full bg-primary-base"
														initial={{ width: 0 }}
														animate={{ width: `${activeJob.progress}%` }}
														transition={{ duration: 0.3 }}
													/>
												</div>
												<p className="mt-2 text-center text-text-soft-400 text-xs">
													Processed{" "}
													{Math.round(
														(activeJob.progress / 100) * activeJob.total,
													)}{" "}
													of {activeJob.total} emails
												</p>
											</motion.div>
										)}
									</AnimatePresence>

									{/* Action buttons */}
									<div className="mt-4 flex items-center justify-between">
										<button
											type="button"
											onClick={() => setCsvFile(null)}
											disabled={!csvFile || isVerifying}
											className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-text-sub-600 ring-1 ring-stroke-soft-200/50 transition-all duration-200 hover:bg-bg-weak-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
										>
											<Icon name="trash" className="h-4 w-4" />
											<span className="text-sm">Clear</span>
										</button>

										<button
											type="button"
											onClick={handleStartVerification}
											disabled={isVerifying || !csvFile}
											className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary-base px-4 text-static-white transition-all duration-200 hover:bg-primary-darker active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-50"
										>
											{isVerifying ? (
												<>
													<Icon
														name="loader"
														className="h-4 w-4 animate-spin"
													/>
													<span className="text-sm">Processing...</span>
												</>
											) : (
												<>
													<Icon name="play" className="h-4 w-4" />
													<span className="text-sm">Start Verification</span>
												</>
											)}
										</button>
									</div>
								</div>
							</div>

							{/* Section separator - full width line */}
							<div className="relative py-4">
								<div className="absolute top-1/2 right-[-100vw] left-[-100vw] h-px bg-stroke-soft-200/50" />
							</div>

							{/* Recent Jobs Section */}
							<div>
								<div className="relative flex items-center justify-between px-6 py-4">
									<div className="flex items-center gap-2">
										<Icon name="layers" className="h-4 w-4 text-text-sub-600" />
										<h3 className="font-medium text-label-md text-text-strong-950">
											Recent Jobs
										</h3>
									</div>
									<button
										type="button"
										onClick={() => fetchJobs(currentPage)}
										className="flex h-8 w-8 items-center justify-center rounded-lg text-text-sub-600 ring-1 ring-stroke-soft-200/50 transition-all hover:bg-bg-weak-50"
									>
										<Icon
											name="refresh-cw"
											className={cn("h-4 w-4", isLoadingJobs && "animate-spin")}
										/>
									</button>
									{/* Top border extending to edges */}
									<div className="absolute top-0 right-[-100vw] left-[-100vw] h-px bg-stroke-soft-200/50" />
									{/* Bottom border extending to edges */}
									<div className="absolute right-[-100vw] bottom-0 left-[-100vw] h-px bg-stroke-soft-200/50" />
								</div>

								{/* Jobs List */}
								<div>
									{isLoadingJobs ? (
										<div className="space-y-0">
											{Array.from({ length: 3 }).map((_, i) => (
												<div
													key={i}
													className="flex items-center justify-between border-stroke-soft-200/50 border-b px-6 py-4"
												>
													<div className="space-y-2">
														<div className="h-4 w-40 animate-pulse rounded bg-bg-weak-100" />
														<div className="h-3 w-24 animate-pulse rounded bg-bg-weak-100" />
													</div>
													<div className="h-6 w-20 animate-pulse rounded bg-bg-weak-100" />
												</div>
											))}
										</div>
									) : jobs.length === 0 ? (
										<div className="flex flex-col items-center justify-center py-12">
											<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-weak-50">
												<Icon
													name="layers"
													className="h-8 w-8 text-text-soft-400"
												/>
											</div>
											<h2 className="mb-2 font-medium text-text-strong-950">
												No bulk jobs yet
											</h2>
											<p className="text-center text-text-sub-600">
												Upload a CSV file above to start your first bulk
												verification
											</p>
										</div>
									) : (
										<>
											{jobs.map((job) => (
												<div key={job.id}>
													{/* Job Row */}
													<button
														type="button"
														onClick={() =>
															job.status === "completed" &&
															toggleJobExpansion(job.id)
														}
														disabled={job.status !== "completed"}
														className={cn(
															"flex w-full items-center justify-between border-stroke-soft-200/50 px-6 py-4 text-left transition-colors",
															job.status === "completed" &&
																"cursor-pointer hover:bg-bg-weak-50/50",
															expandedJobId === job.id && "bg-bg-weak-50/30",
														)}
													>
														{/* Left: Job info */}
														<div className="flex items-center gap-4">
															<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-stroke-soft-200/40 bg-bg-weak-50">
																<FileFormatIcon.Root
																	format="CSV"
																	color="green"
																	className="h-5 w-5"
																/>
															</div>
															<div>
																<p className="font-medium text-sm text-text-strong-950">
																	{job.name || `Job ${job.id.slice(0, 8)}`}
																</p>
																<div className="mt-0.5 flex items-center gap-2 text-xs">
																	<span className="text-text-sub-600">
																		{job.totalEmails} emails
																	</span>
																	<span className="text-text-disabled-300">
																		•
																	</span>
																	<span className="text-text-sub-600">
																		{formatDate(job.createdAt)}
																	</span>
																</div>
															</div>
														</div>

														{/* Right: Status, stats, and actions */}
														<div className="flex items-center gap-4">
															{job.status === "completed" && job.stats && (
																<div className="flex items-center gap-3 text-xs">
																	<span className="text-success-base">
																		{job.stats.deliverable} valid
																	</span>
																	<span className="text-warning-base">
																		{job.stats.risky} risky
																	</span>
																	<span className="text-error-base">
																		{job.stats.undeliverable} invalid
																	</span>
																</div>
															)}
															{getStatusBadge(job.status)}
															{job.status === "completed" && (
																<Icon
																	name={
																		expandedJobId === job.id
																			? "chevron-up"
																			: "chevron-down"
																	}
																	className="h-4 w-4 text-text-soft-400"
																/>
															)}
														</div>
													</button>

													{/* Expanded Job Details */}
													<AnimatePresence>
														{expandedJobId === job.id && (
															<motion.div
																initial={{ opacity: 0, height: 0 }}
																animate={{ opacity: 1, height: "auto" }}
																exit={{ opacity: 0, height: 0 }}
																className="overflow-hidden border-stroke-soft-200/50 border-b bg-bg-weak-50/30"
															>
																<div className="px-6 py-4">
																	{/* Header with search and download */}
																	<div className="mb-4 flex items-center justify-between">
																		<div className="flex items-center gap-3">
																			<Input.Root
																				size="xsmall"
																				className="w-56"
																			>
																				<Input.Wrapper>
																					<Input.Icon
																						as={Icon}
																						name="search"
																						size="xsmall"
																					/>
																					<Input.Input
																						placeholder="Search emails..."
																						value={resultsSearch}
																						onChange={(e) => {
																							setResultsSearch(e.target.value);
																							setResultsPage(1);
																						}}
																					/>
																				</Input.Wrapper>
																			</Input.Root>
																			<BulkResultsFilterDropdown
																				value={resultsFilter}
																				onChange={setResultsFilter}
																			/>
																			<span className="text-sm text-text-sub-600">
																				{filteredResults.length} results
																			</span>
																		</div>
																		<button
																			type="button"
																			onClick={(e) => {
																				e.stopPropagation();
																				downloadResultsCSV(job, jobResults);
																			}}
																			className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-text-sub-600 ring-1 ring-stroke-soft-200/50 transition-all hover:bg-bg-white-0"
																		>
																			<Icon
																				name="file-download"
																				className="h-4 w-4"
																			/>
																			<span className="text-sm">
																				Download CSV
																			</span>
																		</button>
																	</div>

																	{/* Results table */}
																	{isLoadingResults ? (
																		<div className="space-y-2">
																			{Array.from({ length: 3 }).map((_, i) => (
																				<div
																					key={i}
																					className="flex items-center justify-between rounded-lg border border-stroke-soft-200/50 bg-bg-white-0 px-4 py-3"
																				>
																					<div className="h-4 w-48 animate-pulse rounded bg-bg-weak-100" />
																					<div className="h-4 w-16 animate-pulse rounded bg-bg-weak-100" />
																				</div>
																			))}
																		</div>
																	) : (
																		<div className="space-y-1">
																			{paginatedResults.map((result, idx) => (
																				<button
																					type="button"
																					key={`${result.email}-${idx}`}
																					onClick={() =>
																						setSelectedEmail(result)
																					}
																					className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-stroke-soft-200/50 bg-bg-white-0 px-4 py-3 text-left transition-all hover:bg-bg-weak-50"
																				>
																					<div className="flex items-center gap-3">
																						{/* Provider icon */}
																						<div
																							className={cn(
																								"flex h-7 w-7 shrink-0 items-center justify-center rounded",
																								result.state === "deliverable"
																									? "bg-success-alpha-10"
																									: result.state === "risky"
																										? "bg-warning-alpha-10"
																										: "bg-error-alpha-10",
																							)}
																						>
																							{(() => {
																								const ProviderIcon =
																									getProviderIcon(result.email);
																								if (ProviderIcon) {
																									return (
																										<ProviderIcon className="h-3.5 w-3.5" />
																									);
																								}
																								return (
																									<Icon
																										name="mail"
																										className="h-3.5 w-3.5 text-text-soft-400"
																									/>
																								);
																							})()}
																						</div>
																						<span className="font-mono text-sm text-text-strong-950">
																							{result.email}
																						</span>
																					</div>
																					<div className="flex items-center gap-4">
																						<span
																							className={cn(
																								"font-semibold text-sm tabular-nums",
																								getScoreColor(result.score),
																							)}
																						>
																							{result.score}
																						</span>
																						<span
																							className={cn(
																								"rounded-full px-2 py-0.5 text-xs capitalize",
																								getStateBadge(result.state),
																							)}
																						>
																							{result.state}
																						</span>
																						<Icon
																							name="chevron-right"
																							className="h-4 w-4 text-text-soft-400"
																						/>
																					</div>
																				</button>
																			))}
																		</div>
																	)}

																	{/* Results pagination */}
																	{resultsTotalPages > 1 && (
																		<div className="mt-4 flex items-center justify-between">
																			<span className="text-sm text-text-sub-600">
																				Showing{" "}
																				{(resultsPage - 1) * resultsPageSize +
																					1}
																				–
																				{Math.min(
																					resultsPage * resultsPageSize,
																					filteredResults.length,
																				)}{" "}
																				of {filteredResults.length}
																			</span>
																			<PaginationControls
																				currentPage={resultsPage}
																				totalPages={resultsTotalPages}
																				onPageChange={setResultsPage}
																			/>
																		</div>
																	)}
																</div>
															</motion.div>
														)}
													</AnimatePresence>
												</div>
											))}

											{/* Jobs Pagination */}
											{totalPages > 1 && (
												<div className="flex items-center justify-between border-stroke-soft-200/50 border-t px-6 py-4">
													<div className="flex items-center gap-2 text-sm text-text-sub-600">
														<span>
															Showing {(currentPage - 1) * pageSize + 1} to{" "}
															{Math.min(currentPage * pageSize, jobs.length)} of{" "}
															{jobs.length}
														</span>
														<PageSizeDropdown
															value={pageSize}
															onValueChange={setPageSize}
														/>
													</div>
													<PaginationControls
														currentPage={currentPage}
														totalPages={totalPages}
														onPageChange={fetchJobs}
														isLoading={isLoadingJobs}
													/>
												</div>
											)}
										</>
									)}
								</div>
							</div>

							{/* How It Works Section */}
							<div>
								<div className="relative flex items-center gap-2 px-6 py-4">
									<Icon name="info" className="h-4 w-4 text-text-sub-600" />
									<h3 className="font-medium text-label-md text-text-strong-950">
										How bulk verification works
									</h3>
									{/* Top border extending to edges */}
									<div className="absolute top-0 right-[-100vw] left-[-100vw] h-px bg-stroke-soft-200/50" />
									{/* Bottom border extending to edges */}
									<div className="absolute right-[-100vw] bottom-0 left-[-100vw] h-px bg-stroke-soft-200/50" />
								</div>

								{/* Info grid */}
								<div className="grid grid-cols-2">
									<div className="border-stroke-soft-200/50 border-r border-b px-6 py-4">
										<div className="flex items-center gap-3">
											<Icon
												name="upload"
												className="h-4 w-4 text-text-soft-400"
											/>
											<span className="text-sm text-text-sub-600">
												Upload a CSV file with email addresses
											</span>
										</div>
									</div>
									<div className="border-stroke-soft-200/50 border-b px-6 py-4">
										<div className="flex items-center gap-3">
											<Icon
												name="activity"
												className="h-4 w-4 text-text-soft-400"
											/>
											<span className="text-sm text-text-sub-600">
												Each email uses 1 credit from your quota
											</span>
										</div>
									</div>
									<div className="border-stroke-soft-200/50 border-r px-6 py-4">
										<div className="flex items-center gap-3">
											<Icon
												name="check-circle"
												className="h-4 w-4 text-text-soft-400"
											/>
											<span className="text-sm text-text-sub-600">
												Get detailed results for each email
											</span>
										</div>
									</div>
									<div className="border-stroke-soft-200/50 px-6 py-4">
										<div className="flex items-center gap-3">
											<Icon
												name="download"
												className="h-4 w-4 text-text-soft-400"
											/>
											<span className="text-sm text-text-sub-600">
												Download cleaned list or export results
											</span>
										</div>
									</div>
								</div>
							</div>
							{/* Bottom border of How it works extending to edges */}
							<div className="relative">
								<div className="absolute top-0 right-[-100vw] left-[-100vw] h-px bg-stroke-soft-200/50" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<EmailDetailModal
				email={selectedEmail}
				onClose={() => setSelectedEmail(null)}
			/>
			;
		</>
	);
};

export default BulkPage;
