import { logger } from "@verifio/logger";
import { checkConnection, ensureTableExists } from "./database";

export const loader = async () => {
	try {
		// Ensure PostgreSQL table exists
		await ensureTableExists();

		// Check PostgreSQL connection health
		const isConnected = await checkConnection();

		if (isConnected) {
			logger.info("PostgreSQL connection health check passed");
		} else {
			logger.warn("PostgreSQL connection check failed");
		}
	} catch (e) {
		logger.error(
			{ error: e instanceof Error ? e.message : String(e) },
			"Error during PostgreSQL initialization",
		);
	}
};
