import { RedisCache } from "@verifio/cache/redis-client";

export const redis = new RedisCache("api-key", 86400); // 1 day TTL
