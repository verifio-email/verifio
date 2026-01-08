"use client";

import { cn } from "@verifio/ui/cn";
import * as FileFormatIcon from "@verifio/ui/file-format-icon";
import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { BulkProgress, BulkResults } from "../types";

interface BulkUploadInputProps {
	onResultsReceived: (results: BulkResults) => void;
}

export const BulkUploadInput = ({
	onResultsReceived,
}: BulkUploadInputProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [csvFile, setCsvFile] = useState<File | null>(null);
	const [isVerifying, setIsVerifying] = useState(false);
	const [bulkProgress, setBulkProgress] = useState<BulkProgress | null>(null);

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
				setBulkProgress({
					jobId,
					status: "processing",
					progress: 0,
					total: emails.length,
				});

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
							try {
								const resultsRes = await fetch(
									`/api/verify/v1/bulk-jobs/${jobId}/results`,
									{ credentials: "include" },
								);
								const resultsData = await resultsRes.json();
								if (resultsData.success && resultsData.data) {
									onResultsReceived({
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

	return (
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
							{Math.round((bulkProgress.progress / 100) * bulkProgress.total)}{" "}
							of {bulkProgress.total} emails
						</p>
					</div>
				)}
			</div>

			{/* Action Row */}
			<div className="flex items-center justify-end gap-2 border-stroke-soft-200/50 border-t p-3">
				<button
					type="button"
					onClick={handleBulkVerify}
					disabled={isVerifying || !csvFile}
					className="flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary-base px-4 text-static-white transition-all duration-200 hover:bg-primary-darker active:scale-[0.995] disabled:opacity-50"
				>
					{isVerifying ? (
						<>
							<Icon name="loader" className="h-4 w-4 animate-spin" />
							<span className="label-sm">Processing...</span>
						</>
					) : (
						<span className="label-sm">Start bulk verify</span>
					)}
				</button>
			</div>
		</>
	);
};
