// Default values for upload configuration

const defaults = {
	PORT: "8004",
	PG_URL: "postgresql://verifio:verifio123@localhost:5432/verifio",
	REDIS_URL: "redis://:verifio123@localhost:6379",
	BASE_URL: "https://local.verifio.email",
	NODE_ENV: "development",
	UPLOAD_STORAGE_PATH: "docker-data/uploads",
	MAX_FILE_SIZE: "10485760", // 10MB
} as const;

export const uploadConfig = {
	port: Number(process.env.PORT || defaults.PORT),
	PG_URL: process.env.PG_URL || defaults.PG_URL,
	REDIS_URL: process.env.REDIS_URL || defaults.REDIS_URL,
	BASE_URL: process.env.BASE_URL || defaults.BASE_URL,
	NODE_ENV: process.env.NODE_ENV || defaults.NODE_ENV,
	UPLOAD_STORAGE_PATH:
		process.env.UPLOAD_STORAGE_PATH || defaults.UPLOAD_STORAGE_PATH,
	MAX_FILE_SIZE: Number(process.env.MAX_FILE_SIZE || defaults.MAX_FILE_SIZE),

	constants: {
		maxFileSize: 10 * 1024 * 1024, // 10MB
		allowedMimeTypes: [
			"image/jpeg",
			"image/jpg",
			"image/png",
			"image/gif",
			"image/webp",
			"image/svg+xml",
		],
	},
};
