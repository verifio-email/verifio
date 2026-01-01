"use client";

import { useSidebar } from "@fe/dashboard/providers/sidebar-provider";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
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
			// Call the verify API
			const response = await fetch("/api/verify/v1/email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
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

			// Call bulk verify API
			const response = await fetch("/api/verify/v1/bulk", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ emails }),
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

				// Poll for status
				const pollStatus = async () => {
					const statusRes = await fetch(`/api/verify/v1/jobs/${jobId}`);
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
							// Fetch the results
							try {
								const resultsRes = await fetch(
									`/api/verify/v1/jobs/${jobId}/results`,
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
				<div className="px-52 2xl:px-[350px]">
					<div className="border-stroke-soft-200/50 border-r border-l px-7 py-10">
						<div className="mx-auto max-w-3xl">
							<div className="overflow-hidden rounded-[20px] bg-bg-white-0 shadow-regular-md ring-1 ring-stroke-soft-200/50">
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

			{/* Bulk Results Section */}
			{bulkResults && bulkResults.results.length > 0 && (
				<div className="border-stroke-soft-200/50 border-b">
					<div className="px-52 2xl:px-[350px]">
						<div className="border-stroke-soft-200/50 border-r border-l px-7 py-8">
							<div className="mx-auto max-w-4xl">
								<div className="mb-4 flex items-center justify-between">
									<h3 className="font-semibold text-lg text-text-strong-950">
										Bulk Verification Results
									</h3>
									<button
										type="button"
										onClick={() => setBulkResults(null)}
										className="text-text-soft-400 hover:text-text-sub-600"
									>
										<Icon name="x" className="h-5 w-5" />
									</button>
								</div>

								{/* Stats Cards */}
								{bulkResults.stats && (
									<div className="mb-6 grid grid-cols-5 gap-3">
										<div className="rounded-lg bg-bg-weak-50 p-3 text-center">
											<p className="font-bold text-2xl text-text-strong-950">
												{bulkResults.stats.total}
											</p>
											<p className="text-text-soft-400 text-xs">Total</p>
										</div>
										<div className="rounded-lg bg-success-alpha-10 p-3 text-center">
											<p className="font-bold text-2xl text-success-base">
												{bulkResults.stats.deliverable}
											</p>
											<p className="text-text-soft-400 text-xs">Deliverable</p>
										</div>
										<div className="rounded-lg bg-warning-alpha-10 p-3 text-center">
											<p className="font-bold text-2xl text-warning-base">
												{bulkResults.stats.risky}
											</p>
											<p className="text-text-soft-400 text-xs">Risky</p>
										</div>
										<div className="rounded-lg bg-error-alpha-10 p-3 text-center">
											<p className="font-bold text-2xl text-error-base">
												{bulkResults.stats.undeliverable}
											</p>
											<p className="text-text-soft-400 text-xs">
												Undeliverable
											</p>
										</div>
										<div className="rounded-lg bg-primary-alpha-10 p-3 text-center">
											<p className="font-bold text-2xl text-primary-base">
												{bulkResults.stats.averageScore}
											</p>
											<p className="text-text-soft-400 text-xs">Avg Score</p>
										</div>
									</div>
								)}

								{/* Results Table */}
								<div className="overflow-hidden rounded-xl border border-stroke-soft-200/50">
									<table className="w-full">
										<thead className="bg-bg-weak-50">
											<tr>
												<th className="px-4 py-3 text-left font-medium text-sm text-text-sub-600">
													Email
												</th>
												<th className="px-4 py-3 text-center font-medium text-sm text-text-sub-600">
													Status
												</th>
												<th className="px-4 py-3 text-center font-medium text-sm text-text-sub-600">
													Score
												</th>
												<th className="px-4 py-3 text-left font-medium text-sm text-text-sub-600">
													Reason
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-stroke-soft-200/50">
											{bulkResults.results.map((result, index) => (
												<tr
													key={`${result.email}-${index}`}
													className="hover:bg-bg-weak-50"
												>
													<td className="px-4 py-3">
														<span className="font-mono text-sm text-text-strong-950">
															{result.email}
														</span>
													</td>
													<td className="px-4 py-3 text-center">
														<span
															className={cn(
																"inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-xs",
																getStateBadge(result.state),
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
																className="h-3 w-3"
															/>
															{result.state}
														</span>
													</td>
													<td className="px-4 py-3 text-center">
														<span
															className={cn(
																"font-semibold",
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
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Recent Runs Section */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className={cn(isCollapsed ? "px-24 2xl:px-32" : "px-6 2xl:px-32")}>
					<div className="border-stroke-soft-200/50 border-r border-l p-6">
						<div className="mx-auto max-w-3xl">
							<h2 className="mb-4 font-semibold text-lg text-text-strong-950">
								Recent Verifications
							</h2>

							<div className="grid gap-4 md:grid-cols-2">
								{recentRuns.length === 0 ? (
									<div className="col-span-2 flex flex-col items-center justify-center rounded-xl border border-stroke-soft-200/50 border-dashed bg-bg-weak-50 py-12">
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
												setEmail(run.email);
												setCurrentResult(run.result);
											}}
											className="rounded-xl border border-stroke-soft-200/50 bg-bg-white-0 p-4 text-left transition-colors hover:bg-bg-weak-50"
										>
											<div className="mb-3 flex items-center gap-3">
												<div
													className={cn(
														"flex h-8 w-8 items-center justify-center rounded-lg",
														run.result.state === "deliverable"
															? "bg-success-alpha-10"
															: run.result.state === "risky"
																? "bg-warning-alpha-10"
																: "bg-error-alpha-10",
													)}
												>
													<Icon
														name={
															run.result.state === "deliverable"
																? "check-circle"
																: run.result.state === "risky"
																	? "alert-triangle"
																	: "x-circle"
														}
														className={cn(
															"h-4 w-4",
															run.result.state === "deliverable"
																? "text-success-base"
																: run.result.state === "risky"
																	? "text-warning-base"
																	: "text-error-base",
														)}
													/>
												</div>
												<span className="flex-1 truncate font-mono text-sm text-text-strong-950">
													{run.email}
												</span>
												<span
													className={cn(
														"font-semibold text-sm",
														getScoreColor(run.result.score),
													)}
												>
													{run.result.score}
												</span>
											</div>

											<div className="flex items-center justify-between text-[13px]">
												<span
													className={cn(
														"rounded-full px-2 py-0.5 text-xs",
														getStateBadge(run.result.state),
													)}
												>
													{run.result.state}
												</span>
												<span className="text-text-soft-400">
													{run.result.duration}ms
												</span>
											</div>
										</button>
									))
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PlaygroundPage;
