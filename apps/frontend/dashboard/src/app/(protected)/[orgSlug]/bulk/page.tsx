"use client";

import { PageSizeDropdown } from "@fe/dashboard/components/page-size-dropdown";
import { PaginationControls } from "@fe/dashboard/components/pagination-controls";
import { useSidebar } from "@fe/dashboard/providers/sidebar-provider";
import { getProviderIcon } from "@fe/dashboard/utils/email-provider-icon";
import {
	getStateBadge,
	getStateColor,
} from "@fe/dashboard/utils/verification-state";
import { cn } from "@verifio/ui/cn";
import * as FileFormatIcon from "@verifio/ui/file-format-icon";
import { Icon } from "@verifio/ui/icon";
import * as Input from "@verifio/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
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

const BulkPage = () => {
	const { isCollapsed } = useSidebar();

	// State
	const [csvFile, setCsvFile] = useState<File | null>(null);
	const [csvPreview, setCsvPreview] = useState<string[]>([]);
	const [totalEmailCount, setTotalEmailCount] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [isVerifying, setIsVerifying] = useState(false);
	const [jobs, setJobs] = useState<BulkJob[]>([]);
	const [isLoadingJobs, setIsLoadingJobs] = useState(true);

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

	const handleDrop = async (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files[0];
		if (file && (file.type === "text/csv" || file.name.endsWith(".csv"))) {
			setCsvFile(file);
			const emails = await parseCSV(file);
			setCsvPreview(emails.slice(0, 5));
			setTotalEmailCount(emails.length);
			toast.success(`Found ${emails.length} emails in "${file.name}"`);
		} else {
			toast.error("Please upload a CSV file");
		}
	};

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && (file.type === "text/csv" || file.name.endsWith(".csv"))) {
			setCsvFile(file);
			const emails = await parseCSV(file);
			setCsvPreview(emails.slice(0, 5));
			setTotalEmailCount(emails.length);
			toast.success(`Found ${emails.length} emails in "${file.name}"`);
		} else {
			toast.error("Please upload a CSV file");
		}
		e.target.value = "";
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
				{/* Header Section - Matching PlaygroundHeader */}
				<div className="border-stroke-soft-200 border-b">
					<div className="mx-auto max-w-2xl">
						<div className="relative border-stroke-soft-200 border-r border-l pt-12 pb-12 text-center">
							<h1 className="relative font-semibold text-2xl text-text-strong-950 md:text-3xl">
								Bulk Verification
							</h1>
							<p className="relative mt-2 text-text-sub-600">
								Upload and verify large email lists efficiently
							</p>
						</div>
					</div>
				</div>

				{/* Content Area with vertical borders */}
				<div className="flex-1">
					<div>
						<div className="flex flex-col">
							{/* Import CSV Section - Matching Playground BulkUploadInput */}
							<div>
								<div className="mx-auto max-w-2xl border-stroke-soft-200 border-r border-l">
									{/* Bulk CSV Upload - Drag & Drop */}
									<div className="p-8">
										{/* Hidden file input wrapped in label for better compatibility */}
										<label className="block">
											<input
												type="file"
												accept=".csv"
												className="hidden"
												onChange={handleFileSelect}
											/>

											{/* Drop zone - fixed height to prevent layout shift */}
											<div
												onDragOver={handleDragOver}
												onDragLeave={handleDragLeave}
												onDrop={handleDrop}
												className={cn(
													"flex h-[200px] cursor-pointer flex-col rounded-lg border-2 border-dashed transition-all duration-200",
													isDragging
														? "border-primary-base bg-primary-alpha-10"
														: "border-stroke-soft-200 hover:border-primary-base hover:bg-bg-weak-50",
													csvFile && "border-success-base bg-success-alpha-10",
												)}
											>
												{csvFile && csvPreview.length > 0 ? (
													<div className="flex h-full flex-col">
														{/* File info header */}
														<div className="flex items-center justify-between border-stroke-soft-200 border-b px-4 py-3">
															<div className="flex items-center gap-3">
																<div className="flex h-9 w-9 items-center justify-center rounded-md bg-success-alpha-10">
																	<FileFormatIcon.Root
																		format="CSV"
																		color="green"
																		className="h-5 w-5"
																	/>
																</div>
																<div>
																	<p className="font-medium text-sm text-text-strong-950">
																		{csvFile.name}
																	</p>
																	<p className="text-text-soft-400 text-xs">
																		{(csvFile.size / 1024).toFixed(1)} KB •{" "}
																		{totalEmailCount} emails
																	</p>
																</div>
															</div>
															<button
																type="button"
																onClick={(e) => {
																	e.preventDefault();
																	e.stopPropagation();
																	setCsvFile(null);
																	setCsvPreview([]);
																}}
																className="flex h-7 w-7 items-center justify-center rounded-md text-text-soft-400 transition-colors hover:bg-bg-weak-50 hover:text-text-strong-950"
															>
																<Icon name="x" className="h-4 w-4" />
															</button>
														</div>
														{/* Email preview section - table-like list */}
														<div className="flex flex-1 flex-col divide-y divide-stroke-soft-200">
															{csvPreview.slice(0, 3).map((email, idx) => (
																<div
																	key={`${email}-${idx}`}
																	className="flex items-center gap-3 px-4 py-2"
																>
																	<Icon
																		name="mail"
																		className="h-4 w-4 text-success-base"
																	/>
																	<span className="font-mono text-text-sub-600 text-xs">
																		{email}
																	</span>
																</div>
															))}
															{totalEmailCount > 3 && (
																<div className="flex items-center justify-center px-4 py-2">
																	<span className="text-text-soft-400 text-xs">
																		+{totalEmailCount - 3} more emails
																	</span>
																</div>
															)}
														</div>
													</div>
												) : (
													<div className="flex h-full flex-col items-center justify-center gap-3">
														<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-bg-weak-50">
															<FileFormatIcon.Root
																format="CSV"
																color="green"
																className="h-7 w-7"
															/>
														</div>
														<div className="text-center">
															<p className="font-medium text-text-strong-950">
																Import CSV File
															</p>
															<p className="mt-1 text-sm text-text-soft-400">
																Drop file or click here to choose file.
															</p>
														</div>
													</div>
												)}
											</div>
										</label>

										{/* Progress bar during bulk verify */}
										{activeJob && (
											<div className="mt-4">
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
											</div>
										)}
									</div>

									{/* Action Row */}
									<div className="relative flex items-center justify-end gap-2 p-3">
										<div className="absolute top-0 right-[-100vw] left-[-100vw] h-px bg-stroke-soft-200" />
										<button
											type="button"
											onClick={handleStartVerification}
											disabled={isVerifying || !csvFile}
											className={cn(
												"flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary-base px-4 text-static-white transition-all duration-200 hover:bg-primary-darker active:scale-[0.995] disabled:opacity-50",
												!csvFile && "invisible",
											)}
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
										{/* Bottom border extending to viewport edges */}
										<div className="absolute right-[-100vw] bottom-0 left-[-100vw] h-px bg-stroke-soft-200" />
									</div>
								</div>
							</div>

							{/* Recent Jobs Section */}
							<div>
								<div
									className={cn(
										"relative flex items-center justify-between py-4",
										isCollapsed ? "px-24 2xl:px-32" : "px-6 2xl:px-32",
									)}
								>
									<div className="flex items-center gap-2">
										<Icon name="layers" className="h-4 w-4 text-text-sub-600" />
										<h3 className="font-medium text-label-md text-text-strong-950">
											Recent Jobs
										</h3>
									</div>

									<div className="absolute right-[-100vw] bottom-0 left-[-100vw] h-px bg-stroke-soft-200" />
								</div>

								{/* Jobs Grid with Pie Charts */}
								<div
									className={cn(
										"h-full",
										isCollapsed ? "px-24 2xl:px-32" : "px-6 2xl:px-32",
									)}
								>
									{isLoadingJobs ? (
										<div className="grid grid-cols-3 gap-4">
											{Array.from({ length: 3 }).map((_, i) => (
												<div
													key={i}
													className="flex flex-col items-center justify-center rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6"
												>
													<div className="h-32 w-32 animate-pulse rounded-full bg-bg-weak-100" />
													<div className="mt-4 h-4 w-24 animate-pulse rounded bg-bg-weak-100" />
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
											{/* Outer box container  */}
											<div className="border-stroke-soft-200 border-r border-b border-l">
												{/* Grid Rows - 3 jobs per row */}
												{Array.from({
													length: Math.ceil(jobs.length / 3),
												}).map((_, rowIndex) => {
													const rowJobs = jobs.slice(
														rowIndex * 3,
														(rowIndex + 1) * 3,
													);
													return (
														<div key={rowIndex}>
															<div className="grid grid-cols-3 divide-x divide-stroke-soft-200">
																{rowJobs.map((job) => {
																	const PIE_COLORS = {
																		deliverable: "#22c55e",
																		risky: "#60a5fa",
																		undeliverable: "#38bdf8",
																		unknown: "#2dd4bf",
																	};
																	const pieData = job.stats
																		? [
																				{
																					name: "Valid",
																					value: job.stats.deliverable,
																					color: PIE_COLORS.deliverable,
																				},
																				{
																					name: "Risky",
																					value: job.stats.risky,
																					color: PIE_COLORS.risky,
																				},
																				{
																					name: "Invalid",
																					value: job.stats.undeliverable,
																					color: PIE_COLORS.undeliverable,
																				},
																				{
																					name: "Unknown",
																					value: job.stats.unknown,
																					color: PIE_COLORS.unknown,
																				},
																			].filter((d) => d.value > 0)
																		: [];
																	const deliverablePercent =
																		job.stats && job.totalEmails > 0
																			? Math.round(
																					(job.stats.deliverable /
																						job.totalEmails) *
																						100,
																				)
																			: 0;

																	return (
																		<div
																			key={job.id}
																			className="flex flex-col px-6"
																		>
																			<button
																				key={job.id}
																				type="button"
																				onClick={() =>
																					job.status === "completed" &&
																					toggleJobExpansion(job.id)
																				}
																				disabled={job.status !== "completed"}
																				className={cn(
																					"relative flex w-full flex-col items-center border-stroke-soft-200 border-r border-l bg-bg-white-0 transition-all",
																					job.status === "completed" &&
																						"cursor-pointer hover:bg-bg-weak-50",
																					expandedJobId === job.id &&
																						"bg-bg-weak-50",
																				)}
																			>
																				{/* Title/Label Section with border below */}
																				<div className="relative flex w-full flex-col items-center border-stroke-soft-200 border-b px-6 py-4">
																					<p className="text-center font-medium text-sm text-text-strong-950">
																						{job.name ||
																							`Job ${job.id.slice(0, 8)}`}
																					</p>
																					<div className="flex items-center gap-1 text-text-sub-600 text-xs">
																						<Icon
																							name="folder"
																							className="h-3 w-3"
																						/>
																						<span>
																							{job.totalEmails} emails
																						</span>
																					</div>
																				</div>

																				{/* Content Area - Pie chart etc */}
																				<div className="flex w-full flex-col items-center">
																					{/* Pie Chart */}
																					{job.status === "completed" &&
																					pieData.length > 0 ? (
																						<div className="relative h-32 w-32">
																							<ResponsiveContainer
																								width="100%"
																								height="100%"
																							>
																								<PieChart>
																									<Pie
																										data={pieData}
																										cx="50%"
																										cy="50%"
																										innerRadius={40}
																										outerRadius={55}
																										paddingAngle={2}
																										dataKey="value"
																										stroke="none"
																									>
																										{pieData.map(
																											(entry, index) => (
																												<Cell
																													key={`cell-${index}`}
																													fill={entry.color}
																												/>
																											),
																										)}
																									</Pie>
																									<Tooltip
																										offset={10}
																										wrapperStyle={{
																											zIndex: 100,
																										}}
																										content={({
																											active,
																											payload,
																										}) => {
																											if (
																												active &&
																												payload &&
																												payload.length
																											) {
																												const data =
																													payload[0]?.payload;
																												const total =
																													pieData.reduce(
																														(sum, d) =>
																															sum + d.value,
																														0,
																													);
																												const percent =
																													Math.round(
																														(data.value /
																															total) *
																															100,
																													);
																												return (
																													<div className="overflow-hidden rounded-lg bg-white shadow-lg">
																														<div
																															className="px-3 py-1.5 font-semibold text-white text-xs"
																															style={{
																																backgroundColor:
																																	data.color,
																															}}
																														>
																															{data.name.toUpperCase()}
																														</div>
																														<div className="px-3 py-2 text-center text-gray-900 text-sm">
																															{data.value} (
																															{percent}
																															%)
																														</div>
																													</div>
																												);
																											}
																											return null;
																										}}
																									/>
																								</PieChart>
																							</ResponsiveContainer>
																							{/* Center Label */}
																							<div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
																								<span className="font-bold text-text-strong-950 text-xs">
																									{deliverablePercent}%
																								</span>
																								<span className="text-[11px] text-text-sub-600">
																									Deliverable
																								</span>
																							</div>
																						</div>
																					) : (
																						<div className="flex h-32 w-32 items-center justify-center">
																							{getStatusBadge(job.status)}
																						</div>
																					)}

																					{/* Stats Table */}
																					{job.status === "completed" &&
																						job.stats && (
																							<div className="mt-4 grid w-full grid-cols-4 divide-x divide-stroke-soft-200 border-stroke-soft-200 border-t">
																								<div className="flex flex-col items-center bg-bg-white-0 py-2">
																									<span className="text-text-soft-400 text-xs">
																										Valid
																									</span>
																									<span className="font-semibold text-sm text-success-base">
																										{job.stats.deliverable}
																									</span>
																								</div>
																								<div className="flex flex-col items-center bg-bg-white-0 py-2">
																									<span className="text-text-soft-400 text-xs">
																										Risky
																									</span>
																									<span className="font-semibold text-sm text-warning-base">
																										{job.stats.risky}
																									</span>
																								</div>
																								<div className="flex flex-col items-center bg-bg-white-0 py-2">
																									<span className="text-text-soft-400 text-xs">
																										Invalid
																									</span>
																									<span className="font-semibold text-error-base text-sm">
																										{job.stats.undeliverable}
																									</span>
																								</div>
																								<div className="flex flex-col items-center bg-bg-white-0 py-2">
																									<span className="text-text-soft-400 text-xs">
																										Unknown
																									</span>
																									<span className="font-semibold text-sm text-text-sub-600">
																										{job.stats.unknown}
																									</span>
																								</div>
																							</div>
																						)}
																				</div>
																			</button>
																		</div>
																	);
																})}

																{/* Fill empty grid cells if less than 3 jobs in row */}
																{rowJobs.length < 3 &&
																	Array.from({
																		length: 3 - rowJobs.length,
																	}).map((_, i) => (
																		<div
																			key={`empty-${rowIndex}-${i}`}
																			className="bg-bg-white-0 p-6"
																		/>
																	))}
															</div>

															{/* Expanded Job Details */}
															<AnimatePresence>
																{expandedJobId &&
																	rowJobs.some(
																		(j) => j.id === expandedJobId,
																	) && (
																		<motion.div
																			initial={{ opacity: 0, height: 0 }}
																			animate={{ opacity: 1, height: "auto" }}
																			exit={{ opacity: 0, height: 0 }}
																			className="overflow-hidden border-stroke-soft-200 border-t bg-bg-weak-50/30"
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
																										setResultsSearch(
																											e.target.value,
																										);
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
																							const job = jobs.find(
																								(j) => j.id === expandedJobId,
																							);
																							if (job)
																								downloadResultsCSV(
																									job,
																									jobResults,
																								);
																						}}
																						className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-text-sub-600 ring-1 ring-stroke-soft-200 transition-all hover:bg-bg-white-0"
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
																						{Array.from({ length: 3 }).map(
																							(_, i) => (
																								<div
																									key={i}
																									className="flex items-center justify-between rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-4 py-3"
																								>
																									<div className="h-4 w-48 animate-pulse rounded bg-bg-weak-100" />
																									<div className="h-4 w-16 animate-pulse rounded bg-bg-weak-100" />
																								</div>
																							),
																						)}
																					</div>
																				) : (
																					<div className="space-y-1">
																						{paginatedResults.map(
																							(result, idx) => (
																								<button
																									type="button"
																									key={`${result.email}-${idx}`}
																									onClick={() =>
																										setSelectedEmail(
																											result as unknown as EmailVerificationData,
																										)
																									}
																									className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-4 py-3 text-left transition-all hover:bg-bg-weak-50"
																								>
																									<div className="flex items-center gap-3">
																										<div
																											className={cn(
																												"flex h-7 w-7 shrink-0 items-center justify-center rounded",
																												result.state ===
																													"deliverable"
																													? "bg-success-alpha-10"
																													: result.state ===
																															"risky"
																														? "bg-warning-alpha-10"
																														: "bg-error-alpha-10",
																											)}
																										>
																											{(() => {
																												const ProviderIcon =
																													getProviderIcon(
																														result.email,
																													);
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
																												getStateColor(
																													result.state,
																												),
																											)}
																										>
																											{result.score}
																										</span>
																										<span
																											className={cn(
																												"rounded-full px-2 py-0.5 text-xs capitalize",
																												getStateBadge(
																													result.state,
																												),
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
																							),
																						)}
																					</div>
																				)}

																				{/* Results pagination */}
																				{resultsTotalPages > 1 && (
																					<div className="mt-4 flex items-center justify-between">
																						<span className="text-sm text-text-sub-600">
																							Showing{" "}
																							{(resultsPage - 1) *
																								resultsPageSize +
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
													);
												})}
											</div>
											{/* Jobs Pagination */}
											{totalPages > 1 && (
												<div className="flex items-center justify-between border-stroke-soft-200 border-t px-6 py-4">
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
													/>
												</div>
											)}
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<EmailDetailModal
				email={selectedEmail as unknown as EmailVerificationData}
				onClose={() => setSelectedEmail(null)}
			/>
		</>
	);
};

export default BulkPage;
