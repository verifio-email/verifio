/**
 * Encrypted Database Client
 *
 * Wraps the standard database client to provide transparent encryption/decryption
 * for sensitive fields like JWKS private keys and OAuth tokens.
 *
 * This module exports the same interface as @verifio/db/client but with
 * encryption middleware applied for sensitive operations.
 */

import { db as baseDb } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { eq } from "drizzle-orm";
import { decryptField, encryptField } from "./encryption";

// Re-export the base db for non-sensitive operations
export { baseDb as db };

/**
 * Create a new JWKS record with encrypted private key
 */
export async function createEncryptedJwks(data: {
	id: string;
	publicKey: string;
	privateKey: string;
	createdAt: Date;
	expiresAt?: Date | null;
}) {
	return baseDb.insert(schema.jwks).values({
		id: data.id,
		publicKey: data.publicKey,
		privateKey: encryptField(data.privateKey), // Encrypt before storage
		createdAt: data.createdAt,
		expiresAt: data.expiresAt,
	});
}

/**
 * Get JWKS record with decrypted private key
 */
export async function getDecryptedJwks(id: string) {
	const result = await baseDb.query.jwks.findFirst({
		where: eq(schema.jwks.id, id),
	});

	if (!result) return null;

	return {
		...result,
		privateKey: decryptField(result.privateKey), // Decrypt on read
	};
}

/**
 * Get all JWKS records with decrypted private keys
 */
export async function getAllDecryptedJwks() {
	const results = await baseDb.query.jwks.findMany();

	return results.map((jwk) => ({
		...jwk,
		privateKey: decryptField(jwk.privateKey), // Decrypt on read
	}));
}

/**
 * Update JWKS private key (encrypts before storage)
 */
export async function updateEncryptedJwks(id: string, privateKey: string) {
	return baseDb
		.update(schema.jwks)
		.set({
			privateKey: encryptField(privateKey),
		})
		.where(eq(schema.jwks.id, id));
}
