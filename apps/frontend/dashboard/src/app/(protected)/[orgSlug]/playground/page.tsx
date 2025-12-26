"use client";

import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { toast } from "sonner";

type TabType = "single" | "bulk";

interface RecentRun {
	id: string;
	email: string;
	endpoint: string;
	status: "success" | "failed" | "pending";
	timestamp: Date;
}

// Mock recent runs data
const mockRecentRuns: RecentRun[] = [
	{
		id: "1",
		email: "test@example.com",
		endpoint: "Single Verify",
		status: "success",
		timestamp: new Date(),
	},
];

const PlaygroundPage = () => {
	const [activeTab, setActiveTab] = useState<TabType>("single");
	const [email, setEmail] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [recentRuns, setRecentRuns] = useState<RecentRun[]>(mockRecentRuns);
	const [csvFile, setCsvFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const tabs = [
		{ id: "single" as TabType, label: "Verify", dots: 3 },
		{ id: "bulk" as TabType, label: "Bulk", dots: 2, badge: "New" },
	];

	const handleVerify = async () => {
		if (!email.trim()) {
			toast.error("Please enter an email address");
			return;
		}

		setIsVerifying(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));

		const newRun: RecentRun = {
			id: Date.now().toString(),
			email: email,
			endpoint: tabs.find((t) => t.id === activeTab)?.label || "Verify",
			status: "success",
			timestamp: new Date(),
		};

		setRecentRuns([newRun, ...recentRuns.slice(0, 9)]);
		toast.success("Email verified successfully!");
		setIsVerifying(false);
	};

	const handleGetCode = () => {
		const codeSnippet = `fetch('https://api.verifio.com/v1/verify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email: '${email || "example@email.com"}' })
})`;

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

	const handleBulkVerify = async () => {
		if (!csvFile) {
			toast.error("Please upload a CSV file first");
			return;
		}
		setIsVerifying(true);
		await new Promise((resolve) => setTimeout(resolve, 2000));
		toast.success("Bulk verification started!");
		setIsVerifying(false);
	};

	return (
		<div className="flex-1 overflow-y-auto">
			{/* Header Section */}
			<div className="border-stroke-soft-200 border-b">
				<div className="px-[340px] 2xl:px-[450px]">
					<div className="relative border-stroke-soft-200 border-r border-l pt-24 pb-12 text-center">
						<h1 className="relative font-semibold text-2xl text-text-strong-950 md:text-3xl">
							Playground
						</h1>
						<p className="relative mt-2 text-text-sub-600">
							API, Docs and Playground - all in one place
						</p>
					</div>
				</div>
			</div>

			{/* Tab Navigation Section */}
			<div className="border-stroke-soft-200 border-b">
				<div className="px-[340px] 2xl:px-[450px]">
					<div className="flex items-center justify-center border-stroke-soft-200 border-r border-l py-6">
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
			<div className="border-stroke-soft-200 border-b">
				<div className="px-52 2xl:px-[350px]">
					<div className="border-stroke-soft-200 border-r border-l px-7 py-10">
						<div className="mx-auto max-w-3xl">
							<div className="overflow-hidden rounded-[20px] bg-bg-white-0 shadow-regular-md ring-1 ring-stroke-soft-200">
								{activeTab === "single" ? (
									<>
										{/* Single Email Input */}
										<label className="block cursor-text overflow-hidden p-3">
											<div className="flex items-center gap-3 transition-all duration-[400ms]">
												<div className="pointer-events-none w-max shrink-0 rounded-lg bg-bg-weak-50 px-2.5 py-1 text-text-soft-400 ring-1 ring-stroke-soft-200">
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
										<div className="flex flex-wrap items-center justify-between gap-2 border-stroke-soft-200 border-t p-3">
											<div className="flex items-center gap-2">
												<button
													type="button"
													className="flex h-8 w-8 items-center justify-center rounded-lg text-text-sub-600 ring-1 ring-stroke-soft-200 transition-all duration-200 hover:bg-bg-weak-50 active:scale-[0.99]"
													aria-label="Settings"
												>
													<Icon name="settings" className="h-5 w-5" />
												</button>
												<button
													type="button"
													className="flex h-8 w-8 items-center justify-center rounded-lg text-text-sub-600 ring-1 ring-stroke-soft-200 transition-all duration-200 hover:bg-bg-weak-50 active:scale-[0.99]"
													aria-label="Table view"
												>
													<Icon name="grid" className="h-5 w-5" />
												</button>
												<button
													type="button"
													onClick={() => setEmail("")}
													className="flex h-8 w-8 items-center justify-center rounded-lg text-text-sub-600 ring-1 ring-stroke-soft-200 transition-all duration-200 hover:bg-bg-weak-50 active:scale-[0.99]"
													aria-label="Clear"
												>
													<Icon name="trash" className="h-5 w-5" />
												</button>
											</div>

											<div className="flex items-center gap-2">
												<button
													type="button"
													onClick={handleGetCode}
													className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-text-sub-600 ring-1 ring-stroke-soft-200 transition-all duration-200 hover:bg-bg-weak-50 active:scale-[0.99]"
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
														: "border-stroke-soft-200 hover:border-primary-base hover:bg-bg-weak-50",
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

											{/* Download template link */}
											<div className="mt-4 flex items-center gap-2 text-text-sub-600">
												<Icon name="download" className="h-4 w-4" />
												<button
													type="button"
													className="label-sm transition-colors hover:text-primary-base"
												>
													Download CSV Template
												</button>
											</div>
										</div>

										{/* Action Row */}
										<div className="flex items-center justify-end gap-2 border-stroke-soft-200 border-t p-3">
											<button
												type="button"
												onClick={handleGetCode}
												className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-text-sub-600 ring-1 ring-stroke-soft-200 transition-all duration-200 hover:bg-bg-weak-50 active:scale-[0.99]"
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

			{/* Recent Runs Section */}
			<div className="border-stroke-soft-200 border-b">
				<div className="px-6 2xl:px-32">
					<div className="border-stroke-soft-200 border-r border-l p-6">
						<div className="mx-auto max-w-3xl">
							<h2 className="mb-4 font-semibold text-lg text-text-strong-950">
								Recent Runs
							</h2>

							<div className="grid gap-4 md:grid-cols-2">
								{recentRuns.length === 0 ? (
									<div className="col-span-2 flex flex-col items-center justify-center rounded-xl border border-stroke-soft-200 border-dashed bg-bg-weak-50 py-12">
										<Icon
											name="clock"
											className="mb-3 h-8 w-8 text-text-disabled-300"
										/>
										<p className="text-text-sub-600">No recent runs yet</p>
										<p className="text-[13px] text-text-soft-400">
											Start a verification to see results here
										</p>
									</div>
								) : (
									recentRuns.map((run) => (
										<div
											key={run.id}
											className="rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-4 transition-colors hover:bg-bg-weak-50"
										>
											<div className="mb-3 flex items-center gap-3">
												<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-weak-50">
													<Icon
														name="mail"
														className="h-4 w-4 text-text-sub-600"
													/>
												</div>
												<span className="flex-1 truncate font-mono text-sm text-text-strong-950">
													{run.email}
												</span>
												<Icon
													name="external-link"
													className="h-4 w-4 shrink-0 text-text-sub-600"
												/>
											</div>

											<div className="flex items-center justify-between text-[13px]">
												<div className="flex items-center gap-4">
													<div>
														<span className="text-text-soft-400">Endpoint</span>
														<span className="ml-2 text-text-sub-600">
															{run.endpoint}
														</span>
													</div>
												</div>
												<div className="flex items-center gap-2">
													<span className="text-text-soft-400">Status</span>
													<span
														className={cn(
															"flex items-center gap-1",
															run.status === "success"
																? "text-success-base"
																: run.status === "failed"
																	? "text-error-base"
																	: "text-warning-base",
														)}
													>
														<Icon
															name={
																run.status === "success"
																	? "check-circle"
																	: run.status === "failed"
																		? "x-circle"
																		: "clock"
															}
															className="h-3.5 w-3.5"
														/>
														{run.status.charAt(0).toUpperCase() +
															run.status.slice(1)}
													</span>
												</div>
											</div>
										</div>
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
