/**
 * Utility functions for email verification state styling
 */

export type VerificationState = "deliverable" | "risky" | "undeliverable" | "unknown";

/**
 * Get icon name based on verification state
 */
export const getStateIcon = (state: string): string => {
  switch (state) {
    case "deliverable":
      return "check-circle";
    case "risky":
      return "alert-triangle";
    case "undeliverable":
      return "cross-circle";
    default:
      return "cross-circle";
  }
};

/**
 * Get text color class based on verification state
 */
export const getStateColor = (state: string): string => {
  switch (state) {
    case "deliverable":
      return "text-success-base";
    case "risky":
      return "text-warning-base";
    case "undeliverable":
      return "text-error-base";
    default:
      return "text-error-base";
  }
};

/**
 * Get badge style classes (background + text color) based on verification state
 */
export const getStateBadge = (state: string): string => {
  switch (state) {
    case "deliverable":
      return "bg-success-alpha-10 text-success-base";
    case "risky":
      return "bg-warning-alpha-10 text-warning-base";
    case "undeliverable":
      return "bg-error-alpha-10 text-error-base";
    default:
      return "bg-bg-weak-50 text-text-sub-600";
  }
};

/**
 * Get background color class based on verification state
 */
export const getStateBgColor = (state: string): string => {
  switch (state) {
    case "deliverable":
      return "bg-success-alpha-10";
    case "risky":
      return "bg-warning-alpha-10";
    case "undeliverable":
      return "bg-error-alpha-10";
    default:
      return "bg-bg-weak-50";
  }
};
