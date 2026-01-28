const defaults = {
	PORT: "8006",
	REDIS_URL: "redis://:verifio123@localhost:6379",
	NODE_ENV: "development",
} as const;

export const toolsConfig = {
	port: Number(process.env.PORT || defaults.PORT),
	REDIS_URL: process.env.REDIS_URL || defaults.REDIS_URL,
	NODE_ENV: process.env.NODE_ENV || defaults.NODE_ENV,
	rateLimit: {
		windowMs: 60000,
		syntaxMax: 100,
		disposableMax: 100,
		deliverabilityMax: 30,
		listHealthMax: 10,
		catchallMax: 20,
	},
};
