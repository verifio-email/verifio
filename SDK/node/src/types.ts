/**
 * Verifio SDK Types
 * Type definitions for email verification
 */

// ============================================================================
// VERIFICATION STATE
// ============================================================================

/**
 * Primary verdict for an email address
 */
export type VerificationState =
	| "deliverable"
	| "undeliverable"
	| "risky"
	| "unknown";

/**
 * Risk level assessment
 */
export type RiskLevel = "low" | "medium" | "high";

/**
 * Reason codes for verification results
 */
export type VerificationReason =
	// Deliverable
	| "valid_mailbox"
	| "accepted_email"
	// Undeliverable
	| "invalid_syntax"
	| "invalid_domain"
	| "no_mx_records"
	| "mailbox_not_found"
	| "mailbox_full"
	// Risky
	| "disposable_email"
	| "role_based_email"
	| "catch_all_domain"
	| "free_email_provider"
	// Unknown
	| "timeout"
	| "connection_error"
	| "unknown_error";

// ============================================================================
// CHECK RESULTS
// ============================================================================

export interface SyntaxCheckResult {
	valid: boolean;
	error?: string;
}

export interface DnsCheckResult {
	valid: boolean;
	domainExists: boolean;
	hasMx: boolean;
	mxRecords: string[];
	preferredMx?: string;
	error?: string;
}

export interface DisposableCheckResult {
	isDisposable: boolean;
	provider?: string;
}

export interface RoleCheckResult {
	isRole: boolean;
	role?: string;
}

export interface FreeProviderCheckResult {
	isFree: boolean;
	provider?: string;
}

export interface TypoCheckResult {
	hasTypo: boolean;
	suggestion?: string;
	originalDomain?: string;
	suggestedDomain?: string;
}

export interface SmtpCheckResult {
	valid: boolean | null;
	mailboxExists: boolean | null;
	isCatchAll: boolean | null;
	response?: string;
	error?: string;
}

export interface VerificationChecks {
	syntax: SyntaxCheckResult;
	dns: DnsCheckResult;
	disposable: DisposableCheckResult;
	role: RoleCheckResult;
	freeProvider: FreeProviderCheckResult;
	typo: TypoCheckResult;
	smtp: SmtpCheckResult;
}

// ============================================================================
// ANALYTICS
// ============================================================================

export interface VerificationAnalytics {
	didYouMean: string | null;
	domainAge: number | null;
	smtpProvider: string | null;
	riskLevel: RiskLevel;
	qualityIndicators: string[];
	warnings: string[];
}

// ============================================================================
// VERIFICATION RESULT
// ============================================================================

export interface VerificationResult {
	id?: string;
	email: string;
	user: string;
	domain: string;
	tag: string | null;
	state: VerificationState;
	reason: VerificationReason;
	score: number;
	checks: VerificationChecks;
	analytics: VerificationAnalytics;
	duration: number;
	verifiedAt: string;
}

// ============================================================================
// BULK VERIFICATION
// ============================================================================

export interface ScoreDistribution {
	excellent: number;
	good: number;
	fair: number;
	poor: number;
}

export interface VerificationBreakdown {
	disposable: number;
	roleBased: number;
	freeProvider: number;
	catchAll: number;
	syntaxErrors: number;
	dnsErrors: number;
	typosDetected: number;
}

export interface BulkVerificationStats {
	total: number;
	processed: number;
	deliverable: number;
	undeliverable: number;
	risky: number;
	unknown: number;
	breakdown: VerificationBreakdown;
	averageScore: number;
	scoreDistribution: ScoreDistribution;
	startedAt: string;
	completedAt: string | null;
	totalDuration: number;
	averageDuration: number;
}

export type BulkJobStatus =
	| "pending"
	| "processing"
	| "completed"
	| "failed"
	| "cancelled";

export interface BulkVerificationJob {
	id: string;
	status: BulkJobStatus;
	totalEmails: number;
	processedEmails: number;
	stats: BulkVerificationStats | null;
	createdAt: string;
	completedAt: string | null;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

export interface PaginatedResponse<T> {
	success: boolean;
	data?: {
		items: T[];
		pagination: {
			page: number;
			limit: number;
			total: number;
			totalPages: number;
		};
	};
	error?: string;
}

// ============================================================================
// OPTIONS
// ============================================================================

export interface VerifyOptions {
	skipDisposable?: boolean;
	skipRole?: boolean;
	skipTypo?: boolean;
}

export interface VerifioConfig {
	apiKey: string;
	baseUrl?: string;
}

export interface PaginationOptions {
	page?: number;
	limit?: number;
}
