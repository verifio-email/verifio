import { logger } from "@verifio/logger";
import { redis } from "@verifio/tools/lib/redis";

export const loader = async () => {
	try {
		await redis.healthCheck();
		logger.info("Redis connected");
	} catch (e) {
		logger.error(
			{ error: e instanceof Error ? e.message : String(e) },
			"Error during service initialization",
		);
	}
};
