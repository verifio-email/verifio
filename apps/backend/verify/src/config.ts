/**
 * Verify Service Configuration
 */

const defaults = {
	PORT: "3040",
	BASE_URL: "https://local.verifio.email",
	NODE_ENV: "development",
	MAX_BULK_EMAILS: "10000",
	DEFAULT_TIMEOUT: "5000",
	CREDITS_SERVICE_URL: "http://localhost:8030",
	INTERNAL_SERVICE_SECRET: "internal-secret",
	REDIS_URL: "redis://:verifio123@localhost:6379",
} as const;

export const verifyConfig = {
	port: Number(process.env.PORT || defaults.PORT),
	environment: process.env.NODE_ENV || defaults.NODE_ENV,
	maxBulkEmails: Number(
		process.env.MAX_BULK_EMAILS || defaults.MAX_BULK_EMAILS,
	),
	defaultTimeout: Number(
		process.env.DEFAULT_TIMEOUT || defaults.DEFAULT_TIMEOUT,
	),
	baseUrl: process.env.BASE_URL || defaults.BASE_URL,
	creditsServiceUrl:
		process.env.CREDITS_SERVICE_URL || defaults.CREDITS_SERVICE_URL,
	internalSecret:
		process.env.INTERNAL_SERVICE_SECRET || defaults.INTERNAL_SERVICE_SECRET,
	redisUrl: process.env.REDIS_URL || defaults.REDIS_URL,
};
