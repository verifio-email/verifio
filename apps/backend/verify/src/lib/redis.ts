import { RedisCache } from "@verifio/cache/redis-client";
import { verifyConfig } from "@verifio/verify/verify.config";

export const redis = new RedisCache(
	"verify-ratelimit",
	120,
	verifyConfig.redisUrl,
);
