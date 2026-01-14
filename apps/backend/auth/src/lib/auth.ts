import { randomBytes } from "node:crypto";
import { createId } from "@paralleldrive/cuid2";
import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { logger } from "@verifio/logger";
import {
	sendOrganizationInviteEmail,
	sendPasswordResetEmail,
} from "@verifio/react-email";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import {
	admin,
	apiKey,
	bearer,
	jwt,
	openAPI,
	organization,
} from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { authConfig } from "../auth.config";
import { redis } from "./redis";

// API Key generation utilities
const API_KEY_PREFIX = "rl";
const API_KEY_LENGTH = 64;

function generateApiKey(): string {
	const randomPart = randomBytes(API_KEY_LENGTH).toString("base64url");
	return `${API_KEY_PREFIX}_${randomPart}`;
}

function getKeyStart(key: string): string {
	const parts = key.split("_");
	if (parts.length >= 2) {
		return `${parts[0]}_${parts[1]?.substring(0, 8) ?? ""}`;
	}
	return key.substring(0, 12);
}

async function createDefaultApiKey(
	organizationId: string,
	userId: string,
): Promise<void> {
	try {
		const fullKey = generateApiKey();
		const keyStart = getKeyStart(fullKey);
		const keyId = createId();
		const now = new Date();

		await db.insert(schema.apikey).values({
			id: keyId,
			name: "Default",
			start: keyStart,
			prefix: API_KEY_PREFIX,
			key: fullKey,
			organizationId,
			userId,
			refillInterval: null,
			refillAmount: null,
			lastRefillAt: null,
			enabled: true,
			rateLimitEnabled: true,
			rateLimitTimeWindow: 86400000, // 24 hours
			rateLimitMax: 10,
			requestCount: 0,
			remaining: 10,
			lastRequest: null,
			expiresAt: null,
			createdAt: now,
			updatedAt: now,
			permissions: null,
			metadata: null,
		});

		logger.info(`✅ Default API key created for organization ${organizationId}`);
	} catch (error) {
		logger.error("❌ Failed to create default API key:", error);
		// Don't throw - organization is still created, API key just failed
	}
}

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	user: {
		additionalFields: {
			activeOrganizationId: {
				type: "string",
				required: false,
				input: true,
			},
			mode: {
				type: "string",
				required: false,
				input: true,
				defaultValue: "dev",
			},
		},
	},
	secondaryStorage: {
		get: async (key) => {
			return await redis.get(key);
		},
		set: async (key, value, ttl) => {
			if (ttl) await redis.set(key, value, ttl);
			else await redis.set(key, value);
		},
		delete: async (key) => {
			await redis.delete(key);
		},
	},
	after: createAuthMiddleware(async (ctx) => {
		if (ctx.path.startsWith("/sign-up")) {
			const newSession = ctx.context.newSession;
			if (newSession) {
				logger.info("🔐 User registered:", newSession.user);

				// Create organization for email/password signups
				try {
					const user = newSession.user;
					const email = user.email;
					const username = email.split("@")[0] || "workspace";
					const orgName = username.charAt(0).toUpperCase() + username.slice(1);
					const randomSuffix = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
					const slug = `org-${randomSuffix}`;
					const orgId = createId();
					const memberId = createId();
					const now = new Date();

					// Create organization
					await db.insert(schema.organization).values({
						id: orgId,
						name: orgName,
						slug: slug,
						logo: null,
						metadata: null,
						createdAt: now,
					});

					// Create member record
					await db.insert(schema.member).values({
						id: memberId,
						organizationId: orgId,
						userId: user.id,
						role: "owner",
						createdAt: now,
					});

					// Update user's activeOrganizationId
					await db
						.update(schema.user)
						.set({ activeOrganizationId: orgId })
						.where(eq(schema.user.id, user.id));

					logger.info(`✅ Organization "${orgName}" (${slug}) created for user ${email}`);

					// Create default API key
					await createDefaultApiKey(orgId, user.id);
				} catch (error) {
					logger.error("❌ Failed to create organization for new user:", error);
					// Don't throw - user is still created, they can create org manually
				}
			}
		}
	}),
	basePath: "/api/auth/v1",
	telemetry: { enabled: false },
	emailAndPassword: {
		autoSignIn: true,
		enabled: true,
		sendResetPassword: async ({ user, url, token }, request) => {
			logger.info("🔐 Password reset requested for:", user.email);

			// Log reset URL and token only in development for easy testing
			if (authConfig.NODE_ENV === "development") {
				logger.info("🔗 Reset URL (DEV):", url);
				logger.info("🔑 Token (DEV):", token);
			}

			try {
				await sendPasswordResetEmail(user.email, url);
				logger.info(`✅ Password reset email sent to ${user.email}`);
			} catch (error) {
				logger.error("❌ Failed to send password reset email:", error);
				throw new Error("Failed to send password reset email");
			}
		},
	},
	socialProviders: {
		google: {
			clientId: authConfig.GOOGLE_CLIENT_ID as string,
			clientSecret: authConfig.GOOGLE_CLIENT_SECRET as string,
		},
		github: {
			clientId: authConfig.GITHUB_CLIENT_ID as string,
			clientSecret: authConfig.GITHUB_CLIENT_SECRET as string,
		},
	},
	secret: authConfig.BETTER_AUTH_SECRET,
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24,
	},
	trustedOrigins: ["*"],
	plugins: [
		jwt(),
		bearer(),
		admin(),
		apiKey({ defaultPrefix: "rl" }),
		organization({
			sendInvitationEmail: async (data) => {
				const inviteLink = `${authConfig.BASE_URL}/dashboard/accept-invitation?id=${data.id}`;

				logger.info("📧 Organization invitation requested:", {
					email: data.email,
					organization: data.organization.name,
					role: data.role,
					inviter: data.inviter.user.email,
				});

				// Log invite URL in development for easy testing
				if (authConfig.NODE_ENV === "development") {
					logger.info("🔗 Invite URL (DEV):", inviteLink);
				}

				try {
					await sendOrganizationInviteEmail({
						email: data.email,
						inviteLink,
						organizationName: data.organization.name,
						inviterName: data.inviter.user.name || data.inviter.user.email,
						inviterEmail: data.inviter.user.email,
						role: data.role,
					});
					logger.info(
						`✅ Organization invite email sent to ${data.email} using ${inviteLink}`,
					);
				} catch (error) {
					logger.error("❌ Failed to send organization invite email:", error);
					// Don't throw - invitation is still created, email just failed
				}
			},
		}),
		openAPI({ path: "/docs" }),
	],
	advanced: {
		cookiePrefix: "verifio",
		ipAddress: {
			ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
			disableIpTracking: false,
		},
	},
});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema> | null = null;

const getSchema = async () => {
	if (!_schema) {
		_schema = auth.api.generateOpenAPISchema();
	}
	return _schema;
};

export const OpenAPI = {
	getPaths: async (prefix = "/api/auth/v1") => {
		try {
			const { paths } = await getSchema();
			const reference: Record<string, any> = {};

			for (const path of Object.keys(paths)) {
				const pathData = paths[path];
				if (!pathData) continue;

				const key = prefix + path;
				reference[key] = { ...pathData };

				for (const method of Object.keys(pathData)) {
					const operation = reference[key][method];
					if (operation && typeof operation === "object") {
						operation.tags = ["Better Auth"];
					}
				}
			}

			return reference;
		} catch (error) {
			logger.error("Failed to generate OpenAPI paths:", error);
			return {};
		}
	},
	components: async () => {
		try {
			const { components } = await getSchema();
			return components;
		} catch (error) {
			logger.error("Failed to generate OpenAPI components:", error);
			return {};
		}
	},
} as const;
