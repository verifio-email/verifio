/**
 * Email Verification Types
 * Comprehensive type definitions for email verification results
 */

// ============================================================================
// VERIFICATION STATE
// ============================================================================

/**
 * Primary verdict for an email address
 * - deliverable: Email is valid and will receive messages
 * - undeliverable: Email is invalid or doesn't exist
 * - risky: Email exists but has quality concerns (disposable, role-based, etc.)
 * - unknown: Could not determine validity (catch-all, timeout, etc.)
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

/**
 * Syntax validation result
 */
export interface SyntaxCheckResult {
  valid: boolean;
  error?: string;
}

/**
 * DNS/MX record check result
 */
export interface DnsCheckResult {
  valid: boolean;
  domainExists: boolean;
  hasMx: boolean;
  mxRecords: string[];
  preferredMx?: string;
  error?: string;
}

/**
 * Disposable email check result
 */
export interface DisposableCheckResult {
  isDisposable: boolean;
  provider?: string;
}

/**
 * Role-based email check result
 */
export interface RoleCheckResult {
  isRole: boolean;
  role?: string;
}

/**
 * Free email provider check result
 */
export interface FreeProviderCheckResult {
  isFree: boolean;
  provider?: string;
}

/**
 * Typo/suggestion check result
 */
export interface TypoCheckResult {
  hasTypo: boolean;
  suggestion?: string;
  originalDomain?: string;
  suggestedDomain?: string;
}

/**
 * SMTP verification result (Phase 2)
 */
export interface SmtpCheckResult {
  valid: boolean | null;
  mailboxExists: boolean | null;
  isCatchAll: boolean | null;
  response?: string;
  error?: string;
}

/**
 * All verification checks combined
 */
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

/**
 * Deep analytics for an email address
 */
export interface VerificationAnalytics {
  /** Suggested correction for typos */
  didYouMean: string | null;
  /** Domain age in days (if available) */
  domainAge: number | null;
  /** Detected SMTP provider name */
  smtpProvider: string | null;
  /** Overall risk assessment */
  riskLevel: RiskLevel;
  /** Positive quality indicators */
  qualityIndicators: string[];
  /** Warning flags */
  warnings: string[];
}

// ============================================================================
// VERIFICATION RESULT
// ============================================================================

/**
 * Complete verification result for a single email
 */
export interface VerificationResult {
  // Core identification
  email: string;
  user: string;
  domain: string;
  tag: string | null;

  // Primary verdict
  state: VerificationState;
  reason: VerificationReason;
  score: number;

  // Detailed checks
  checks: VerificationChecks;

  // Deep analytics
  analytics: VerificationAnalytics;

  // Metadata
  duration: number;
  verifiedAt: string;
}

// ============================================================================
// BULK VERIFICATION
// ============================================================================

/**
 * Score distribution breakdown
 */
export interface ScoreDistribution {
  excellent: number; // 90-100
  good: number; // 70-89
  fair: number; // 50-69
  poor: number; // 0-49
}

/**
 * Detailed breakdown of verification results
 */
export interface VerificationBreakdown {
  disposable: number;
  roleBased: number;
  freeProvider: number;
  catchAll: number;
  syntaxErrors: number;
  dnsErrors: number;
  typosDetected: number;
}

/**
 * Summary statistics for bulk verification
 */
export interface BulkVerificationStats {
  total: number;
  processed: number;

  // By state
  deliverable: number;
  undeliverable: number;
  risky: number;
  unknown: number;

  // Detailed breakdown
  breakdown: VerificationBreakdown;

  // Quality metrics
  averageScore: number;
  scoreDistribution: ScoreDistribution;

  // Performance
  startedAt: string;
  completedAt: string | null;
  totalDuration: number;
  averageDuration: number;
}

/**
 * Bulk verification job status
 */
export type BulkJobStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

/**
 * Bulk verification job
 */
export interface BulkVerificationJob {
  id: string;
  apiKeyId: string;
  status: BulkJobStatus;
  totalEmails: number;
  processedEmails: number;
  stats: BulkVerificationStats | null;
  createdAt: string;
  completedAt: string | null;
}

// ============================================================================
// VERIFICATION OPTIONS
// ============================================================================

/**
 * Options for email verification
 */
export interface VerificationOptions {
  /** Enable SMTP verification (slower but more accurate) */
  enableSmtp?: boolean;
  /** Timeout in milliseconds for DNS lookups */
  dnsTimeout?: number;
  /** Timeout in milliseconds for SMTP verification */
  smtpTimeout?: number;
  /** Skip disposable check */
  skipDisposable?: boolean;
  /** Skip role-based check */
  skipRole?: boolean;
  /** Skip typo suggestion */
  skipTypo?: boolean;
}

/**
 * Default verification options
 */
export const DEFAULT_VERIFICATION_OPTIONS: Required<VerificationOptions> = {
  enableSmtp: false,
  dnsTimeout: 5000,
  smtpTimeout: 10000,
  skipDisposable: false,
  skipRole: false,
  skipTypo: false,
};
