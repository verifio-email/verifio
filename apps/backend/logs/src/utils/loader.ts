import { db } from "@verifio/db/client";
import { logger } from "@verifio/logger";

export async function loader(): Promise<void> {
	logger.info("Initializing logs service...");

	try {
		await db.execute("SELECT 1 as test");
		logger.info("PostgreSQL database connected");
	} catch (error) {
		logger.error(
			{ error: error instanceof Error ? error.message : String(error) },
			"Failed to connect to PostgreSQL database",
		);
		throw new Error("Database connection failed");
	}

	logger.info("Logs service initialized successfully");
}
