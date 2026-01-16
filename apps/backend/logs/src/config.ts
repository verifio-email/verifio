// Configuration for the logs service

const defaults = {
	PORT: "8020",
	NODE_ENV: "development",
	BASE_URL: "https://local.verifio.email",
	PG_URL: "postgresql://verifio:verifio123@localhost:5432/verifio",
} as const;

export const logsConfig = {
	port: Number(process.env.PORT || defaults.PORT),
	NODE_ENV: process.env.NODE_ENV || defaults.NODE_ENV,
	BASE_URL: process.env.BASE_URL || defaults.BASE_URL,
	PG_URL: process.env.PG_URL || defaults.PG_URL,
};
