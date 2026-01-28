const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

const defaults = {
	PORT: "8001",
	BASE_URL: "https://local.verifio.email",
	MAX_BULK_EMAILS: "10000",
	DEFAULT_TIMEOUT: "5000",
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
	redisUrl: process.env.REDIS_URL || defaults.REDIS_URL,
};
