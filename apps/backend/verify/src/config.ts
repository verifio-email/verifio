/**
 * Verify Service Configuration
 */

export const verifyConfig = {
  port: process.env.VERIFY_PORT || 3040,
  environment: process.env.NODE_ENV || "development",
  maxBulkEmails: Number(process.env.MAX_BULK_EMAILS) || 10000,
  defaultTimeout: Number(process.env.DEFAULT_TIMEOUT) || 5000,
  baseUrl: process.env.BASE_URL || "https://local.verifio.email",
};
