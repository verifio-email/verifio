"use client";

import { SomethingWentWrong } from "@fe/dashboard/components/something-went-wrong";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { BulkJobHeader } from "./components/bulk-job-header";

interface BulkJobData {
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
}

interface BulkJobResultsData {
	results: Array<{
		email: string;
		state: string;
		score: number;
		reason: string;
		result?: {
			email: string;
			user: string;
			domain: string;
			tag: string | null;
			state: "deliverable" | "undeliverable" | "risky" | "unknown";
			reason: string;
			score: number;
		};
	}>;
	stats: {
		deliverable: number;
		undeliverable: number;
		risky: number;
		unknown: number;
		averageScore: number;
	};
}

const BulkJobDetailPage = () => {
	const { jobId } = useParams();

	const {
		data: jobData,
		error: jobError,
		isLoading: jobLoading,
	} = useSWR<{ success: boolean; data: BulkJobData }>(
		jobId ? `/api/verify/v1/bulk-jobs/${jobId}` : null,
		{
			revalidateOnFocus: false,
		},
	);

	const {
		data: resultsData,
		error: resultsError,
		isLoading: resultsLoading,
	} = useSWR<{ success: boolean; data: BulkJobResultsData }>(
		jobId ? `/api/verify/v1/bulk-jobs/${jobId}/results` : null,
		{
			revalidateOnFocus: false,
		},
	);

	if (jobError || resultsError) {
		return (
			<div className="mx-auto max-w-3xl sm:px-8">
				<SomethingWentWrong />
			</div>
		);
	}

	if (!jobData?.data && !jobLoading) {
		return (
			<div className="mx-auto max-w-3xl sm:px-8">
				<div className="py-12 text-center">
					<h2 className="mb-2 font-semibold text-2xl text-gray-900">
						Bulk job not found
					</h2>
					<p className="text-gray-500">
						The bulk job you're looking for doesn't exist or has been deleted.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full">
			<BulkJobHeader
				job={jobData?.data}
				results={resultsData?.data}
				isLoading={jobLoading || resultsLoading}
				isFailed={!!jobError || !!resultsError}
			/>
		</div>
	);
};

export default BulkJobDetailPage;
