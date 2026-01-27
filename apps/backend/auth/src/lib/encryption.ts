/**
 * Field Encryption Utilities
 *
 * Provides AES-256-GCM encryption for sensitive database fields.
 * Uses a master encryption key from environment variable.
 *
 * Security Properties:
 * - AES-256-GCM: Authenticated encryption (confidentiality + integrity)
 * - Random IV per encryption: Same plaintext produces different ciphertext
 * - Key derivation: Uses PBKDF2 to derive encryption key from master secret
 */

import {
	createCipheriv,
	createDecipheriv,
	pbkdf2Sync,
	randomBytes,
} from "node:crypto";
import { authConfig } from "../auth.config";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // 128 bits
const SALT_LENGTH = 32; // 256 bits
const KEY_LENGTH = 32; // 256 bits for AES-256
const PBKDF2_ITERATIONS = 100000;

// Prefix to identify encrypted values
const ENCRYPTED_PREFIX = "enc:v1:";

/**
 * Derive encryption key from master secret using PBKDF2
 */
function deriveKey(salt: Buffer): Buffer {
	const masterSecret = authConfig.ENCRYPTION_KEY;
	if (!masterSecret) {
		throw new Error(
			"ENCRYPTION_KEY is required for field encryption. " +
				"Set this environment variable to a secure random string.",
		);
	}
	return pbkdf2Sync(
		masterSecret,
		salt,
		PBKDF2_ITERATIONS,
		KEY_LENGTH,
		"sha256",
	);
}

/**
 * Encrypt a plaintext string for secure storage
 * Returns: "enc:v1:<salt>:<iv>:<tag>:<ciphertext>" (base64 encoded parts)
 */
export function encryptField(plaintext: string): string {
	if (!plaintext) return plaintext;

	// Don't double-encrypt
	if (plaintext.startsWith(ENCRYPTED_PREFIX)) {
		return plaintext;
	}

	const salt = randomBytes(SALT_LENGTH);
	const key = deriveKey(salt);
	const iv = randomBytes(IV_LENGTH);

	const cipher = createCipheriv(ALGORITHM, key, iv);
	const encrypted = Buffer.concat([
		cipher.update(plaintext, "utf8"),
		cipher.final(),
	]);
	const tag = cipher.getAuthTag();

	// Format: prefix:salt:iv:tag:ciphertext (all base64)
	return [
		ENCRYPTED_PREFIX.slice(0, -1), // Remove trailing colon
		salt.toString("base64"),
		iv.toString("base64"),
		tag.toString("base64"),
		encrypted.toString("base64"),
	].join(":");
}

/**
 * Decrypt a previously encrypted field
 */
export function decryptField(encrypted: string): string {
	if (!encrypted) return encrypted;

	// Check if this is an encrypted value
	if (!encrypted.startsWith(ENCRYPTED_PREFIX)) {
		// Return as-is (might be legacy unencrypted data)
		return encrypted;
	}

	try {
		const parts = encrypted.split(":");
		if (parts.length !== 5) {
			throw new Error("Invalid encrypted format");
		}

		const [, saltB64, ivB64, tagB64, ciphertextB64] = parts;
		if (!saltB64 || !ivB64 || !tagB64 || !ciphertextB64) {
			throw new Error("Missing encrypted parts");
		}

		const salt = Buffer.from(saltB64, "base64");
		const iv = Buffer.from(ivB64, "base64");
		const tag = Buffer.from(tagB64, "base64");
		const ciphertext = Buffer.from(ciphertextB64, "base64");

		const key = deriveKey(salt);
		const decipher = createDecipheriv(ALGORITHM, key, iv);
		decipher.setAuthTag(tag);

		const decrypted = Buffer.concat([
			decipher.update(ciphertext),
			decipher.final(),
		]);

		return decrypted.toString("utf8");
	} catch (error) {
		// If decryption fails, it might be legacy unencrypted data
		// Log warning but return as-is to avoid breaking existing data
		console.warn("Failed to decrypt field, returning as-is:", error);
		return encrypted;
	}
}

/**
 * Check if a value is encrypted
 */
export function isEncrypted(value: string): boolean {
	return value?.startsWith(ENCRYPTED_PREFIX) ?? false;
}
