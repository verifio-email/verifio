/**
 * Tools Service Configuration
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
	BASE_URL: "http://localhost:8005",
	ALLOWED_ORIGINS: "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3004",
	RATE_LIMIT_WINDOW_MS: "60000",
	RATE_LIMIT_SYNTAX_MAX: "100",
	RATE_LIMIT_DISPOSABLE_MAX: "100",
	RATE_LIMIT_DELIVERABILITY_MAX: "30",
	RATE_LIMIT_LIST_HEALTH_MAX: "10",
	RATE_LIMIT_CATCHALL_MAX: "20",
	REDIS_URL: "redis://:verifio123@localhost:6379",
} as const;

export const toolsConfig = {
	port: Number(process.env.PORT || defaults.PORT),
	environment: NODE_ENV,
	isProduction,
	baseUrl: process.env.BASE_URL || defaults.BASE_URL,
	allowedOrigins: (process.env.ALLOWED_ORIGINS || defaults.ALLOWED_ORIGINS).split(
		",",
	),
	rateLimit: {
		windowMs: Number(
			process.env.RATE_LIMIT_WINDOW_MS || defaults.RATE_LIMIT_WINDOW_MS,
		),
		syntaxMax: Number(
			process.env.RATE_LIMIT_SYNTAX_MAX || defaults.RATE_LIMIT_SYNTAX_MAX,
		),
		disposableMax: Number(
			process.env.RATE_LIMIT_DISPOSABLE_MAX ||
				defaults.RATE_LIMIT_DISPOSABLE_MAX,
		),
		deliverabilityMax: Number(
			process.env.RATE_LIMIT_DELIVERABILITY_MAX ||
				defaults.RATE_LIMIT_DELIVERABILITY_MAX,
		),
		listHealthMax: Number(
			process.env.RATE_LIMIT_LIST_HEALTH_MAX ||
				defaults.RATE_LIMIT_LIST_HEALTH_MAX,
		),
		catchallMax: Number(
			process.env.RATE_LIMIT_CATCHALL_MAX ||
				defaults.RATE_LIMIT_CATCHALL_MAX,
		),
	},
	redisUrl: process.env.REDIS_URL || defaults.REDIS_URL,
};
