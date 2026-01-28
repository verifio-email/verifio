/**
 * Syntax Validation Controller
 */

import {
  checkFreeProvider,
  checkTypo,
  isValidEmailSyntax,
  parseEmail,
} from "@verifio/email-verify";
import { logger } from "@verifio/logger";

export async function validateSyntaxHandler(email: string) {
  const startTime = Date.now();

  // Parse email into components
  const parsed = parseEmail(email);

  // Validate syntax
  const isValid = isValidEmailSyntax(email);

  // Check for typos
  let typo: {
    hasTypo: boolean;
    suggestion?: string;
    originalDomain?: string;
    suggestedDomain?: string;
  } | null = null;

  if (parsed?.domain) {
    const typoCheck = checkTypo(email, parsed.domain);
    if (typoCheck.hasTypo) {
      typo = {
        hasTypo: typoCheck.hasTypo,
        suggestion: typoCheck.suggestion,
        originalDomain: typoCheck.originalDomain,
        suggestedDomain: typoCheck.suggestedDomain,
      };
    }
  }

  // Detect provider
  let provider: string | null = null;
  if (parsed?.domain) {
    const providerCheck = checkFreeProvider(parsed.domain);
    provider = providerCheck.provider || null;
  }

  // Collect errors and warnings
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isValid) {
    errors.push("Invalid email format");
  }

  if (!parsed) {
    errors.push("Unable to parse email components");
  }

  if (parsed) {
    if (email.includes("..")) {
      warnings.push("Contains consecutive dots");
    }
    if (email.startsWith(".") || email.endsWith(".")) {
      warnings.push("Starts or ends with a dot");
    }
    if (parsed.tag) {
      warnings.push("Contains plus sign (sub-addressing)");
    }
  }

  const normalized = parsed?.email;

  logger.info(
    {
      email,
      valid: isValid,
      provider,
      hasTypo: typo?.hasTypo || false,
      duration: Date.now() - startTime,
    },
    "Syntax validation completed",
  );

  return {
    success: true,
    data: {
      valid: isValid,
      normalized,
      parsed: parsed
        ? {
          email: parsed.email,
          user: parsed.user || undefined,
          domain: parsed.domain || undefined,
          tag: parsed.tag || undefined,
        }
        : undefined,
      typo: typo || undefined,
      provider,
      rfcCompliant: isValid,
      errors,
      warnings,
    },
  };
}
