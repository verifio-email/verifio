"use client";

import { SomethingWentWrong } from "@fe/dashboard/components/something-went-wrong";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { VerificationResultHeader } from "./components/verification-result-header";

interface VerificationResultData {
	id: string;
	email: string;
	state: string;
	score: number;
	reason: string;
	result: {
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
	} | null;
	createdAt: string;
}

const VerificationResultDetailPage = () => {
	const { resultId } = useParams();

	const {
		data: resultData,
		error,
		isLoading,
	} = useSWR<{ success: boolean; data: VerificationResultData }>(
		resultId ? `/api/verify/v1/results/${resultId}` : null,
		{
			revalidateOnFocus: false,
		},
	);

	if (error) {
		return (
			<div className="mx-auto max-w-3xl sm:px-8">
				<SomethingWentWrong />
			</div>
		);
	}

	if (!resultData?.data && !isLoading) {
		return (
			<div className="mx-auto max-w-3xl sm:px-8">
				<div className="py-12 text-center">
					<h2 className="mb-2 font-semibold text-2xl text-gray-900">
						Verification result not found
					</h2>
					<p className="text-gray-500">
						The verification result you're looking for doesn't exist or has been
						deleted.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full">
			<VerificationResultHeader
				result={resultData?.data}
				isLoading={isLoading}
				isFailed={!!error}
			/>
		</div>
	);
};

export default VerificationResultDetailPage;
