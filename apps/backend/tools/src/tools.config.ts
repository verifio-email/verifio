/**
 * Tools Service Configuration
 */

const defaults = {
	PORT: "8006",
	BASE_URL: "http://localhost:8006",
	NODE_ENV: "development",
	ALLOWED_ORIGINS:
		"http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3004",
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
	NODE_ENV: process.env.NODE_ENV || defaults.NODE_ENV,
	isProduction: process.env.NODE_ENV === "production",
	BASE_URL: process.env.BASE_URL || defaults.BASE_URL,
	allowedOrigins: (
		process.env.ALLOWED_ORIGINS || defaults.ALLOWED_ORIGINS
	).split(","),
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
			process.env.RATE_LIMIT_CATCHALL_MAX || defaults.RATE_LIMIT_CATCHALL_MAX,
		),
	},
	REDIS_URL: process.env.REDIS_URL || defaults.REDIS_URL,
};
