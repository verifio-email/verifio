/**
 * @verifio/email-verify
 * Comprehensive email verification package
 */

// Individual checks (for advanced usage)
export {
	checkDisposable,
	checkDns,
	checkFreeProvider,
	checkRole,
	checkTypo,
	detectSmtpProvider,
	parseEmail,
	validateSyntax,
} from "./checks";
// Data access (for stats or admin purposes)
export { getDisposableCount } from "./checks/disposable";
export { getFreeProviderCount } from "./checks/free-provider";
export { getRoleCount } from "./checks/role";

// Scoring utilities
export {
	calculateScore,
	determineRiskLevel,
	getQualityIndicators,
	getScoreCategory,
	getWarnings,
} from "./scoring";
// Types
export type {
	BulkJobStatus,
	BulkVerificationJob,
	BulkVerificationStats,
	DisposableCheckResult,
	DnsCheckResult,
	FreeProviderCheckResult,
	RiskLevel,
	RoleCheckResult,
	ScoreDistribution,
	SmtpCheckResult,
	SyntaxCheckResult,
	TypoCheckResult,
	VerificationAnalytics,
	VerificationBreakdown,
	VerificationChecks,
	VerificationOptions,
	VerificationReason,
	VerificationResult,
	VerificationState,
} from "./types";
export { DEFAULT_VERIFICATION_OPTIONS } from "./types";
// Main verification functions
export { isValidEmailSyntax, verifyEmail, verifyEmails } from "./verify";
