import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { API_KEY_ENCRYPTION_SECRET } from "@verifio/api-key/api-key.config";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const REQUIRED_KEY_LENGTH = 32; // AES-256 requires 32 bytes (64 hex characters)

/**
 * Validates and returns the encryption key as a Buffer.
 * AES-256 requires exactly 32 bytes (64 hex characters).
 */
function getEncryptionKey(): Buffer {
	if (!API_KEY_ENCRYPTION_SECRET) {
		throw new Error(
			"API_KEY_ENCRYPTION_SECRET is not set. " +
				"Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
		);
	}

	const key = Buffer.from(API_KEY_ENCRYPTION_SECRET, "hex");

	if (key.length !== REQUIRED_KEY_LENGTH) {
		throw new Error(
			"API_KEY_ENCRYPTION_SECRET must be a 64-character hex string (32 bytes). " +
				`Got ${API_KEY_ENCRYPTION_SECRET.length} hex characters (${key.length} bytes). ` +
				`Generate a valid key with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`,
		);
	}

	return key;
}

/**
 * Encrypts an API key using AES-256-GCM
 * @param plainKey - The plain text API key to encrypt
 * @returns Base64-encoded string containing IV + ciphertext + authTag
 */
export function encryptApiKey(plainKey: string): string {
	const iv = randomBytes(IV_LENGTH);
	const key = getEncryptionKey();

	const cipher = createCipheriv(ALGORITHM, key, iv);
	const encrypted = Buffer.concat([
		cipher.update(plainKey, "utf8"),
		cipher.final(),
	]);
	const authTag = cipher.getAuthTag();

	// Combine IV + ciphertext + authTag into a single buffer
	const combined = Buffer.concat([iv, encrypted, authTag]);
	return combined.toString("base64");
}

/**
 * Decrypts an encrypted API key
 * @param encryptedData - Base64-encoded string containing IV + ciphertext + authTag
 * @returns The decrypted plain text API key
 */
export function decryptApiKey(encryptedData: string): string {
	const combined = Buffer.from(encryptedData, "base64");
	const key = getEncryptionKey();

	// Extract IV, ciphertext, and authTag
	const iv = combined.subarray(0, IV_LENGTH);
	const authTag = combined.subarray(combined.length - AUTH_TAG_LENGTH);
	const ciphertext = combined.subarray(
		IV_LENGTH,
		combined.length - AUTH_TAG_LENGTH,
	);

	const decipher = createDecipheriv(ALGORITHM, key, iv);
	decipher.setAuthTag(authTag);

	const decrypted = Buffer.concat([
		decipher.update(ciphertext),
		decipher.final(),
	]);

	return decrypted.toString("utf8");
}
