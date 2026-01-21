import { createClient, type RedisClientType } from "redis";

export class RedisCache {
	private redis: RedisClientType | null = null;
	private prefix: string;
	private defaultTTL: number;
	private redisUrl?: string;

	constructor(prefix: string, defaultTTL: number = 30 * 60, redisUrl?: string) {
		this.prefix = prefix;
		this.defaultTTL = defaultTTL;
		this.redisUrl = redisUrl;
	}

	private async getRedisClient(): Promise<RedisClientType> {
		if (this.redis?.isOpen) {
			return this.redis;
		}
		const redisUrl = this.redisUrl || process.env.REDIS_URL;
		if (!redisUrl) {
			throw new Error("REDIS_URL environment variable is required");
		}
		this.redis = createClient({
			url: redisUrl,
			pingInterval: 4 * 60 * 1000,
			socket: {
				connectTimeout: 15000,
			},
		});

		this.redis.on("error", (err) => {
			console.error(`Redis error for ${this.prefix} cache:`, err);
		});

		await this.redis.connect();
		return this.redis;
	}

	private parseValue<T>(value: string | null): T | undefined {
		if (!value) return undefined;
		try {
			return JSON.parse(value as string) as T;
		} catch {
			return value as unknown as T;
		}
	}

	private stringifyValue(value: unknown): string {
		if (typeof value === "string") {
			return value;
		}

		return JSON.stringify(value);
	}

	private getKey(key: string): string {
		return `${this.prefix}:${key}`;
	}

	async get<T>(key: string): Promise<T | undefined> {
		try {
			const redis = await this.getRedisClient();
			const value = await redis.get(this.getKey(key));
			return this.parseValue<T>(value as string);
		} catch (error) {
			console.error(
				`Redis get error for ${this.prefix} cache, key "${key}":`,
				error,
			);
			this.redis = null;
			return undefined;
		}
	}

	async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
		try {
			const redis = await this.getRedisClient();
			const serializedValue = this.stringifyValue(value);
			const redisKey = this.getKey(key);
			const ttl = ttlSeconds ?? this.defaultTTL;

			await redis.set(redisKey, serializedValue);
			if (ttl > 0) {
				await redis.expire(redisKey, ttl);
			}
		} catch (error) {
			console.error(
				`Redis set error for ${this.prefix} cache, key "${key}":`,
				error,
			);
			this.redis = null;
		}
	}

	async delete(key: string): Promise<void> {
		try {
			const redis = await this.getRedisClient();
			await redis.del(this.getKey(key));
		} catch (error) {
			console.error(
				`Redis delete error for ${this.prefix} cache, key "${key}":`,
				error,
			);
			this.redis = null;
		}
	}

	/**
	 * Atomically increment a counter and return the new value
	 * This is ATOMIC - safe for concurrent access (rate limiting)
	 */
	async incr(key: string): Promise<number> {
		try {
			const redis = await this.getRedisClient();
			const result = await redis.incr(this.getKey(key));
			return result;
		} catch (error) {
			console.error(
				`Redis incr error for ${this.prefix} cache, key "${key}":`,
				error,
			);
			this.redis = null;
			return 0;
		}
	}

	/**
	 * Atomically increment a counter and set expiry if this is the first increment
	 * Returns the new count and whether the key was newly created
	 * This is the preferred method for rate limiting - fully atomic
	 */
	async incrWithExpiry(
		key: string,
		ttlSeconds: number,
	): Promise<{ count: number; isNew: boolean }> {
		try {
			const redis = await this.getRedisClient();
			const redisKey = this.getKey(key);

			// INCR is atomic - if key doesn't exist, it creates with value 1
			const count = await redis.incr(redisKey);

			// If count is 1, this is a new key - set expiry
			const isNew = count === 1;
			if (isNew && ttlSeconds > 0) {
				await redis.expire(redisKey, ttlSeconds);
			}

			return { count, isNew };
		} catch (error) {
			console.error(
				`Redis incrWithExpiry error for ${this.prefix} cache, key "${key}":`,
				error,
			);
			this.redis = null;
			return { count: 0, isNew: false };
		}
	}

	async keys(pattern: string): Promise<string[]> {
		try {
			const redis = await this.getRedisClient();
			const fullPattern = this.getKey(pattern);
			const keys = await redis.keys(fullPattern);
			// Remove the prefix from the returned keys
			return keys.map((key) => key.replace(`${this.prefix}:`, ""));
		} catch (error) {
			console.error(
				`Redis keys error for ${this.prefix} cache, pattern "${pattern}":`,
				error,
			);
			this.redis = null;
			return [];
		}
	}

	async deleteMany(keys: string[]): Promise<void> {
		try {
			const redis = await this.getRedisClient();
			if (keys.length === 0) return;
			const prefixedKeys = keys.map((key) => this.getKey(key));
			await redis.del(prefixedKeys);
		} catch (error) {
			console.error(
				`Redis deleteMany error for ${this.prefix} cache, keys:`,
				error,
			);
			this.redis = null;
		}
	}

	async healthCheck(): Promise<void> {
		try {
			const redis = await this.getRedisClient();
			await redis.ping();
		} catch (error) {
			if (this.redis) {
				await this.redis.quit();
				this.redis = null;
			}
			throw new Error(`Redis health check failed: ${error}`);
		}
	}
}
