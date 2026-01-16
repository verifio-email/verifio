export type TabType = "single" | "bulk";

// Verification result types matching the API response
export interface VerificationResult {
	id?: string; // Database ID returned from authenticated API
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

export interface RecentRun {
	id: string;
	email: string;
	result: VerificationResult;
	timestamp: Date;
}

// Unified activity type for combined single and bulk verifications
export type RecentActivity =
	| {
			type: "single";
			id: string;
			email: string;
			result: VerificationResult;
			timestamp: Date;
	  }
	| {
			type: "bulk";
			id: string;
			name: string | null;
			totalEmails: number;
			status: string;
			stats: {
				deliverable: number;
				undeliverable: number;
				risky: number;
				unknown: number;
				averageScore: number;
			} | null;
			timestamp: Date;
	  };

export interface BulkProgress {
	jobId: string;
	status: string;
	progress: number;
	total: number;
}

export interface BulkStats {
	total: number;
	deliverable: number;
	undeliverable: number;
	risky: number;
	unknown: number;
	averageScore: number;
}

export interface BulkResults {
	results: VerificationResult[];
	stats: BulkStats | null;
}
