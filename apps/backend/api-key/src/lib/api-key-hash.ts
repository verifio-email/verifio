import { createHash, timingSafeEqual } from "node:crypto";

export function hashApiKey(apiKey: string): string {
	return createHash("sha256").update(apiKey, "utf8").digest("hex");
}

export function verifyApiKey(apiKey: string, storedHash: string): boolean {
	const computedHash = hashApiKey(apiKey);

	try {
		const computedBuffer = Buffer.from(computedHash, "hex");
		const storedBuffer = Buffer.from(storedHash, "hex");

		if (computedBuffer.length !== storedBuffer.length) {
			return false;
		}

		return timingSafeEqual(computedBuffer, storedBuffer);
	} catch {
		return false;
	}
}

export function getKeyPrefix(apiKey: string): string {
	const parts = apiKey.split("_");
	if (parts.length >= 2) {
		return `${parts[0]}_${parts[1]?.substring(0, 8) ?? ""}`;
	}
	return apiKey.substring(0, 12);
}
