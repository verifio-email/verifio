import { RedisCache } from "@verifio/cache/redis-client";
import { db } from "@verifio/db/client";
import { logger } from "@verifio/logger";

const redis = new RedisCache("auth");
export const loader = async () => {
	try {
		await redis.healthCheck();
		logger.info("Redis connected");
		await db.execute("SELECT 1 as test");
		logger.info("Postgres connected");
	} catch (e) {
		logger.error(e);
	}
};
