"use client";

import { useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { BulkResultsTable } from "./components/bulk-results-table";
import { BulkUploadInput } from "./components/bulk-upload-input";
import { EmailVerifyInput } from "./components/email-verify-input";
import { PlaygroundHeader } from "./components/playground-header";
import { PlaygroundTabs } from "./components/playground-tabs";
import { RecentActivitiesList } from "./components/recent-activities-list";
import { VerificationResultCard } from "./components/verification-result-card";
import type { BulkResults, TabType, VerificationResult } from "./types";

const PlaygroundPage = () => {
	const [activeTab] = useQueryState("tab", {
		defaultValue: "single" as TabType,
	});
	const [currentResult, setCurrentResult] = useState<VerificationResult | null>(
		null,
	);
	const [bulkResults, setBulkResults] = useState<BulkResults | null>(null);

	const currentTab = (activeTab || "single") as TabType;

	// Handle single email verification
	const handleVerify = async (email: string) => {
		setCurrentResult(null);

		try {
			const response = await fetch("/api/verify/v1/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (data.success && data.data) {
				const result = data.data as VerificationResult;
				setCurrentResult(result);
				mutate("/api/verify/recent-activities");

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
		}
	};

	const handleBulkResultsReceived = (results: BulkResults) => {
		setBulkResults(results);
		mutate("/api/verify/recent-activities");
	};

	return (
		<div className="flex-1 overflow-y-auto">
			<PlaygroundHeader />
			<PlaygroundTabs />
			<div className="border-stroke-soft-100 border-b">
				{currentTab === "single" ? (
					<div className="mx-auto max-w-2xl">
						<div className="border-stroke-soft-100 border-r border-l px-7 py-8">
							<div className="mx-auto max-w-3xl">
								<div>
									<EmailVerifyInput onVerify={handleVerify} />
								</div>
							</div>
						</div>
					</div>
				) : (
					<BulkUploadInput onResultsReceived={handleBulkResultsReceived} />
				)}
			</div>
			{/* Show verification result card when result is available */}
			{currentTab === "single" && currentResult && (
				<VerificationResultCard result={currentResult} />
			)}
			{currentTab === "bulk" &&
				bulkResults &&
				bulkResults.results.length > 0 && (
					<BulkResultsTable
						results={bulkResults.results}
						stats={bulkResults.stats}
						onClose={() => setBulkResults(null)}
					/>
				)}
			<RecentActivitiesList onShowResult={setCurrentResult} />
		</div>
	);
};

export default PlaygroundPage;
