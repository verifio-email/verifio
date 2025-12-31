/**
 * Main Email Verification Function
 * Orchestrates all verification checks and produces final result
 */

import {
  checkDisposable,
  checkDns,
  checkFreeProvider,
  checkRole,
  checkTypo,
  detectSmtpProvider,
  parseEmail,
  validateSyntax,
} from "./checks";
import {
  calculateScore,
  determineRiskLevel,
  getQualityIndicators,
  getWarnings,
} from "./scoring";
import type {
  DEFAULT_VERIFICATION_OPTIONS,
  VerificationChecks,
  VerificationOptions,
  VerificationReason,
  VerificationResult,
  VerificationState,
} from "./types";

/**
 * Default options for verification
 */
const defaultOptions: Required<VerificationOptions> = {
  enableSmtp: false,
  dnsTimeout: 5000,
  smtpTimeout: 10000,
  skipDisposable: false,
  skipRole: false,
  skipTypo: false,
};

/**
 * Verify a single email address
 * Returns comprehensive verification result with deep analytics
 */
export async function verifyEmail(
  email: string,
  options: VerificationOptions = {},
): Promise<VerificationResult> {
  const startTime = Date.now();
  const opts = { ...defaultOptions, ...options };

  // Normalize email
  const normalizedEmail = email.trim().toLowerCase();

  // Initialize result structure
  const checks: VerificationChecks = {
    syntax: { valid: false },
    dns: { valid: false, domainExists: false, hasMx: false, mxRecords: [] },
    disposable: { isDisposable: false },
    role: { isRole: false },
    freeProvider: { isFree: false },
    typo: { hasTypo: false },
    smtp: { valid: null, mailboxExists: null, isCatchAll: null },
  };

  // Step 1: Syntax validation
  checks.syntax = validateSyntax(normalizedEmail);

  if (!checks.syntax.valid) {
    // Invalid syntax - return early
    return buildResult(
      normalizedEmail,
      "",
      "",
      null,
      "undeliverable",
      "invalid_syntax",
      checks,
      startTime,
    );
  }

  // Parse email components
  const parsed = parseEmail(normalizedEmail);
  if (!parsed) {
    return buildResult(
      normalizedEmail,
      "",
      "",
      null,
      "undeliverable",
      "invalid_syntax",
      checks,
      startTime,
    );
  }

  const { user, domain, tag } = parsed;

  // Step 2: DNS/MX verification
  checks.dns = await checkDns(domain, opts.dnsTimeout);

  if (!checks.dns.valid) {
    // Domain doesn't exist or no mail servers
    const reason = !checks.dns.domainExists
      ? "invalid_domain"
      : "no_mx_records";
    return buildResult(
      normalizedEmail,
      user,
      domain,
      tag,
      "undeliverable",
      reason,
      checks,
      startTime,
    );
  }

  // Step 3: Disposable email check
  if (!opts.skipDisposable) {
    checks.disposable = checkDisposable(domain);
  }

  // Step 4: Role-based check
  if (!opts.skipRole) {
    checks.role = checkRole(user);
  }

  // Step 5: Free provider check
  checks.freeProvider = checkFreeProvider(domain);

  // Step 6: Typo check
  if (!opts.skipTypo) {
    checks.typo = checkTypo(normalizedEmail, domain);
  }

  // Step 7: SMTP verification (Phase 2 - placeholder)
  // TODO: Implement SMTP verification
  // For now, we leave it as null (unknown)

  // Determine final state and reason
  const { state, reason } = determineVerdict(checks);

  return buildResult(
    normalizedEmail,
    user,
    domain,
    tag,
    state,
    reason,
    checks,
    startTime,
  );
}

/**
 * Determine the final verdict based on all checks
 */
function determineVerdict(checks: VerificationChecks): {
  state: VerificationState;
  reason: VerificationReason;
} {
  // Undeliverable cases
  if (!checks.syntax.valid) {
    return { state: "undeliverable", reason: "invalid_syntax" };
  }

  if (!checks.dns.domainExists) {
    return { state: "undeliverable", reason: "invalid_domain" };
  }

  if (!checks.dns.hasMx && !checks.dns.valid) {
    return { state: "undeliverable", reason: "no_mx_records" };
  }

  // Risky cases
  if (checks.disposable.isDisposable) {
    return { state: "risky", reason: "disposable_email" };
  }

  if (checks.role.isRole) {
    return { state: "risky", reason: "role_based_email" };
  }

  // Unknown cases
  if (checks.smtp.isCatchAll === true) {
    return { state: "unknown", reason: "catch_all_domain" };
  }

  // Deliverable
  return { state: "deliverable", reason: "valid_mailbox" };
}

/**
 * Build the final verification result
 */
function buildResult(
  email: string,
  user: string,
  domain: string,
  tag: string | null,
  state: VerificationState,
  reason: VerificationReason,
  checks: VerificationChecks,
  startTime: number,
): VerificationResult {
  const score = calculateScore(checks);
  const riskLevel = determineRiskLevel(score, checks);
  const qualityIndicators = getQualityIndicators(checks);
  const warnings = getWarnings(checks);
  const smtpProvider = detectSmtpProvider(checks.dns.mxRecords);

  return {
    // Core identification
    email,
    user,
    domain,
    tag,

    // Primary verdict
    state,
    reason,
    score,

    // Detailed checks
    checks,

    // Deep analytics
    analytics: {
      didYouMean: checks.typo.suggestion || null,
      domainAge: null, // TODO: Implement domain age lookup
      smtpProvider,
      riskLevel,
      qualityIndicators,
      warnings,
    },

    // Metadata
    duration: Date.now() - startTime,
    verifiedAt: new Date().toISOString(),
  };
}

/**
 * Verify multiple emails in parallel
 * Useful for small batches (use workflow for large batches)
 */
export async function verifyEmails(
  emails: string[],
  options: VerificationOptions = {},
  concurrency = 10,
): Promise<VerificationResult[]> {
  const results: VerificationResult[] = [];

  // Process in batches for concurrency control
  for (let i = 0; i < emails.length; i += concurrency) {
    const batch = emails.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((email) => verifyEmail(email, options)),
    );
    results.push(...batchResults);
  }

  return results;
}

/**
 * Quick syntax validation (no async operations)
 */
export function isValidEmailSyntax(email: string): boolean {
  return validateSyntax(email.trim().toLowerCase()).valid;
}
