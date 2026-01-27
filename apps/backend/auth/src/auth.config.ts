const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

function getRequiredEnv(key: string, devDefault?: string): string {
	const value = process.env[key];
	if (value) return value;

	if (isProduction) {
		throw new Error(`Missing required environment variable: ${key}`);
	}

	if (devDefault !== undefined) {
		console.warn(`⚠️  Using development default for ${key}`);
		return devDefault;
	}

	throw new Error(
		`Missing environment variable: ${key} (no default available)`,
	);
}

function getEnv(key: string, defaultValue: string): string {
	return process.env[key] || defaultValue;
}

const DEV_DEFAULTS = {
	PG_URL: "postgresql://verifio:verifio123@localhost:5432/verifio",
	REDIS_URL: "redis://:verifio123@localhost:6379",
	BASE_URL: "https://local.verifio.email",
	BETTER_AUTH_SECRET: `dev-secret-change-in-production-${Math.random()}`,
	ENCRYPTION_KEY: "dev-encryption-key-32-chars-min!", // 32+ chars for AES-256
	GOOGLE_CLIENT_ID: "",
	GOOGLE_CLIENT_SECRET: "",
	GITHUB_CLIENT_ID: "",
	GITHUB_CLIENT_SECRET: "",
} as const;

export const authConfig = {
	port: Number(getEnv("PORT", "8000")),
	NODE_ENV,
	isProduction,

	PG_URL: getRequiredEnv("PG_URL", DEV_DEFAULTS.PG_URL),
	REDIS_URL: getRequiredEnv("REDIS_URL", DEV_DEFAULTS.REDIS_URL),

	BASE_URL: getEnv("BASE_URL", DEV_DEFAULTS.BASE_URL),
	EMAIL_DOMAIN: getEnv("EMAIL_DOMAIN", "verifio.email"),

	BETTER_AUTH_SECRET: getRequiredEnv(
		"BETTER_AUTH_SECRET",
		isProduction ? undefined : DEV_DEFAULTS.BETTER_AUTH_SECRET,
	),

	GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID", DEV_DEFAULTS.GOOGLE_CLIENT_ID),
	GOOGLE_CLIENT_SECRET: getEnv(
		"GOOGLE_CLIENT_SECRET",
		DEV_DEFAULTS.GOOGLE_CLIENT_SECRET,
	),
	GITHUB_CLIENT_ID: getEnv("GITHUB_CLIENT_ID", DEV_DEFAULTS.GITHUB_CLIENT_ID),
	GITHUB_CLIENT_SECRET: getEnv(
		"GITHUB_CLIENT_SECRET",
		DEV_DEFAULTS.GITHUB_CLIENT_SECRET,
	),

	NODE_TLS_REJECT_UNAUTHORIZED: isProduction
		? "1"
		: getEnv("NODE_TLS_REJECT_UNAUTHORIZED", "0"),

	// Encryption key for sensitive fields (JWKS, OAuth tokens) - REQUIRED in production
	ENCRYPTION_KEY: getRequiredEnv(
		"ENCRYPTION_KEY",
		isProduction ? undefined : DEV_DEFAULTS.ENCRYPTION_KEY,
	),
};

if (authConfig.GOOGLE_CLIENT_ID && !authConfig.GOOGLE_CLIENT_SECRET) {
	console.warn(
		"⚠️  GOOGLE_CLIENT_ID is set but GOOGLE_CLIENT_SECRET is missing",
	);
}
if (authConfig.GITHUB_CLIENT_ID && !authConfig.GITHUB_CLIENT_SECRET) {
	console.warn(
		"⚠️  GITHUB_CLIENT_ID is set but GITHUB_CLIENT_SECRET is missing",
	);
}

if (!isProduction) {
	console.log("Auth Config loaded:", {
		NODE_ENV,
		port: authConfig.port,
		BASE_URL: authConfig.BASE_URL,
		hasGoogleOAuth: !!authConfig.GOOGLE_CLIENT_ID,
		hasGitHubOAuth: !!authConfig.GITHUB_CLIENT_ID,
	});
}
