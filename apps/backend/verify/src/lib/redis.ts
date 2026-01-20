/**
 * Redis client for Verify Service
 * Used for distributed rate limiting
 */

import { RedisCache } from "@verifio/cache/redis-client";
import { verifyConfig } from "../verify.config";

export const redis = new RedisCache("verify-ratelimit", 120, verifyConfig.redisUrl);
