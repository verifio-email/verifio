/**
 * Credits Service Configuration
 */

export const creditsConfig = {
  port: process.env.PORT || 8030,
  defaultCreditLimit: 3000,
  // Internal service secret for verify service to call credits endpoints
  internalSecret: process.env.INTERNAL_SERVICE_SECRET || "internal-secret",
};
