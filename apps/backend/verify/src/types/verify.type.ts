import type { VerifyModel } from "@verifio/verify/model/verify.model";

export namespace VerifyTypes {
	export type VerifyEmailBody = typeof VerifyModel.verifyEmailBody.static;
	export type BulkVerifyBody = typeof VerifyModel.bulkVerifyBody.static;
	export type HistoryQuery = typeof VerifyModel.historyQuery.static;
	export type JobQuery = typeof VerifyModel.jobQuery.static;

	export interface VerificationOptions {
		skipDisposable?: boolean;
		skipRole?: boolean;
		skipTypo?: boolean;
	}

	export interface VerifyEmailRequest {
		email: string;
		options?: VerificationOptions;
	}

	export interface BulkVerifyRequest {
		emails: string[];
		name?: string;
		options?: VerificationOptions;
	}

	export interface BulkJob {
		id: string;
		name: string;
		status: "pending" | "processing" | "completed" | "failed";
		total: number;
		processed: number;
		progress: number;
		stats: VerifyModel.BulkVerificationStats | null;
		createdAt: string;
		completedAt: string | null;
		error: string | null;
	}

	export interface VerifyEmailResponse {
		success: true;
		data: typeof VerifyModel.verificationDataSchema.static;
		requestId: string;
	}

	export interface VerifyEmailError {
		success: false;
		error: string;
		requestId: string;
		data?: {
			remaining?: number;
			required?: number;
		};
	}

	export interface BulkVerifyResponse {
		success: true;
		data: {
			jobId: string;
			status: string;
			emailCount: number;
			message: string;
		};
	}

	export interface HistoryResponse {
		success: true;
		data: {
			results: VerifyModel.VerificationResult[];
			pagination: {
				page: number;
				limit: number;
				total: number;
				totalPages: number;
			};
		};
	}

	export interface JobsResponse {
		success: true;
		data: {
			jobs: VerifyModel.Job[];
			pagination: {
				page: number;
				limit: number;
				total: number;
				totalPages: number;
			};
		};
	}
}
