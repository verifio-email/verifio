/**
 * Redis client for Tools Service
 * Used for distributed rate limiting
 */

import { RedisCache } from "@verifio/cache/redis-client";
import { toolsConfig } from "../tools.config";

export const redis = new RedisCache(
	"tools-ratelimit",
	120,
	toolsConfig.redisUrl,
);
