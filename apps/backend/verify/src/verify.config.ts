/**
 * Verify Service Configuration
 */

const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

/**
 * Get a required secret value.
 * Throws in production if missing, warns in development.
 */
function getRequiredSecret(key: string, devDefault: string): string {
	const value = process.env[key];
	if (value) return value;

	if (isProduction) {
		throw new Error(
			`SECURITY ERROR: Missing required secret ${key} in production. ` +
				"This secret is required for secure service-to-service communication.",
		);
	}

	console.warn(
		`⚠️  SECURITY WARNING: Using default ${key} for development. ` +
			"Set this env var explicitly in production.",
	);
	return devDefault;
}

const defaults = {
	PORT: "8001",
	BASE_URL: "https://local.verifio.email",
	MAX_BULK_EMAILS: "10000",
	DEFAULT_TIMEOUT: "5000",
	CREDITS_SERVICE_URL: "http://localhost:8005",
	REDIS_URL: "redis://:verifio123@localhost:6379",
} as const;

export const verifyConfig = {
	port: Number(process.env.PORT || defaults.PORT),
	environment: NODE_ENV,
	isProduction,
	maxBulkEmails: Number(
		process.env.MAX_BULK_EMAILS || defaults.MAX_BULK_EMAILS,
	),
	defaultTimeout: Number(
		process.env.DEFAULT_TIMEOUT || defaults.DEFAULT_TIMEOUT,
	),
	baseUrl: process.env.BASE_URL || defaults.BASE_URL,
	creditsServiceUrl:
		process.env.CREDITS_SERVICE_URL || defaults.CREDITS_SERVICE_URL,
	// Internal service secret - REQUIRED in production
	internalSecret: getRequiredSecret(
		"INTERNAL_SERVICE_SECRET",
		"dev-internal-secret-do-not-use-in-prod",
	),
	redisUrl: process.env.REDIS_URL || defaults.REDIS_URL,
};
