import { logger } from "@verifio/logger";

export async function loader() {
	try {
		logger.info("Verify Service initialized successfully");
	} catch (error) {
		logger.error(
			{ error: error instanceof Error ? error.message : String(error) },
			"Failed to initialize Verify Service",
		);
		throw error;
	}
}
