/**
 * Email Syntax Validation
 * RFC 5322 compliant email format validation
 */

import type { SyntaxCheckResult } from "../types";

/**
 * Email validation regex pattern
 * Based on RFC 5322 with practical adjustments
 */
const EMAIL_REGEX =
  /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

/**
 * Simpler email regex for quick validation
 */
const SIMPLE_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email syntax
 */
export function validateSyntax(email: string): SyntaxCheckResult {
  // Trim and lowercase
  const normalizedEmail = email.trim().toLowerCase();

  // Check if empty
  if (!normalizedEmail) {
    return {
      valid: false,
      error: "Email address is empty",
    };
  }

  // Check length constraints
  if (normalizedEmail.length > 254) {
    return {
      valid: false,
      error: "Email address exceeds maximum length of 254 characters",
    };
  }

  // Check for @ symbol
  if (!normalizedEmail.includes("@")) {
    return {
      valid: false,
      error: "Email address must contain @ symbol",
    };
  }

  // Split into local and domain parts
  const atIndex = normalizedEmail.lastIndexOf("@");
  const localPart = normalizedEmail.substring(0, atIndex);
  const domainPart = normalizedEmail.substring(atIndex + 1);

  // Validate local part length (max 64 characters)
  if (localPart.length === 0) {
    return {
      valid: false,
      error: "Local part (before @) cannot be empty",
    };
  }

  if (localPart.length > 64) {
    return {
      valid: false,
      error: "Local part exceeds maximum length of 64 characters",
    };
  }

  // Validate domain part
  if (domainPart.length === 0) {
    return {
      valid: false,
      error: "Domain part (after @) cannot be empty",
    };
  }

  if (domainPart.length > 255) {
    return {
      valid: false,
      error: "Domain exceeds maximum length of 255 characters",
    };
  }

  // Check for consecutive dots
  if (normalizedEmail.includes("..")) {
    return {
      valid: false,
      error: "Email address cannot contain consecutive dots",
    };
  }

  // Check for leading/trailing dots in local part
  if (localPart.startsWith(".") || localPart.endsWith(".")) {
    return {
      valid: false,
      error: "Local part cannot start or end with a dot",
    };
  }

  // Check for leading/trailing dots or hyphens in domain
  if (
    domainPart.startsWith(".") ||
    domainPart.endsWith(".") ||
    domainPart.startsWith("-") ||
    domainPart.endsWith("-")
  ) {
    return {
      valid: false,
      error: "Domain cannot start or end with a dot or hyphen",
    };
  }

  // Check domain has at least one dot (TLD)
  if (!domainPart.includes(".")) {
    return {
      valid: false,
      error: "Domain must contain at least one dot",
    };
  }

  // Check TLD length (min 2 characters)
  const tld = domainPart.split(".").pop() || "";
  if (tld.length < 2) {
    return {
      valid: false,
      error: "Top-level domain must be at least 2 characters",
    };
  }

  // Use simple regex first for performance
  if (!SIMPLE_EMAIL_REGEX.test(normalizedEmail)) {
    return {
      valid: false,
      error: "Invalid email format",
    };
  }

  // Full RFC 5322 validation
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return {
      valid: false,
      error: "Email format does not comply with RFC 5322",
    };
  }

  return {
    valid: true,
  };
}

/**
 * Parse email into components
 */
export interface EmailComponents {
  email: string;
  user: string;
  domain: string;
  tag: string | null;
}

/**
 * Parse email address into its components
 */
export function parseEmail(email: string): EmailComponents | null {
  const normalizedEmail = email.trim().toLowerCase();

  if (!validateSyntax(normalizedEmail).valid) {
    return null;
  }

  const atIndex = normalizedEmail.lastIndexOf("@");
  let user = normalizedEmail.substring(0, atIndex);
  const domain = normalizedEmail.substring(atIndex + 1);

  // Check for plus-tag (e.g., user+tag@domain.com)
  let tag: string | null = null;
  const plusIndex = user.indexOf("+");
  if (plusIndex !== -1) {
    tag = user.substring(plusIndex + 1);
    user = user.substring(0, plusIndex);
  }

  return {
    email: normalizedEmail,
    user,
    domain,
    tag,
  };
}
