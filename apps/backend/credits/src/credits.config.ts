/**
 * Credits Service Configuration
 */

const defaults = {
  PORT: "8030",
  BASE_URL: "https://local.verifio.email",
  NODE_ENV: "development",
  DEFAULT_CREDIT_LIMIT: "3000",
  INTERNAL_SERVICE_SECRET: "internal-secret",
} as const;

export const creditsConfig = {
  port: Number(process.env.PORT || defaults.PORT),
  environment: process.env.NODE_ENV || defaults.NODE_ENV,
  baseUrl: process.env.BASE_URL || defaults.BASE_URL,
  defaultCreditLimit: Number(process.env.DEFAULT_CREDIT_LIMIT || defaults.DEFAULT_CREDIT_LIMIT),
  // Internal service secret for verify service to call credits endpoints
  internalSecret: process.env.INTERNAL_SERVICE_SECRET || defaults.INTERNAL_SERVICE_SECRET,
};
