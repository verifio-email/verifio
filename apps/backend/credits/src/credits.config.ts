const defaults = {
	PORT: "8005",
	PG_URL: "postgresql://verifio:verifio123@localhost:5432/verifio",
	BASE_URL: "https://local.verifio.email",
	NODE_ENV: "development",
	DEFAULT_CREDIT_LIMIT: "3000",
} as const;

export const creditsConfig = {
	port: Number(process.env.PORT || defaults.PORT),
	PG_URL: process.env.PG_URL || defaults.PG_URL,
	BASE_URL: process.env.BASE_URL || defaults.BASE_URL,
	NODE_ENV: process.env.NODE_ENV || defaults.NODE_ENV,
	DEFAULT_CREDIT_LIMIT: Number(
		process.env.DEFAULT_CREDIT_LIMIT || defaults.DEFAULT_CREDIT_LIMIT,
	),
	isProduction: process.env.NODE_ENV === "production",
};
