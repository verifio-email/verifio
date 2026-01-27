/**
 * Credits Service Configuration
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
	PORT: "8005",
	BASE_URL: "https://local.verifio.email",
	DEFAULT_CREDIT_LIMIT: "3000",
} as const;

export const creditsConfig = {
	port: Number(process.env.PORT || defaults.PORT),
	environment: NODE_ENV,
	isProduction,
	baseUrl: process.env.BASE_URL || defaults.BASE_URL,
	defaultCreditLimit: Number(
		process.env.DEFAULT_CREDIT_LIMIT || defaults.DEFAULT_CREDIT_LIMIT,
	),
	// Internal service secret - REQUIRED in production
	internalSecret: getRequiredSecret(
		"INTERNAL_SERVICE_SECRET",
		"dev-internal-secret-do-not-use-in-prod",
	),
};
