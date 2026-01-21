import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { logger } from "@verifio/logger";
import {
	sendOrganizationInviteEmail,
	sendPasswordResetEmail,
} from "@verifio/react-email";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
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
import { encryptField } from "./encryption";
import { redis } from "./redis";

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
	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					logger.info("User registered:", user.email);

					try {
						const username = user.email.split("@")[0] || "workspace";


						const sanitizedName = username
							.replace(/[^a-zA-Z0-9\s-]/g, "")
							.trim()
							.slice(0, 50);

						const orgName = sanitizedName.length > 0
							? sanitizedName.charAt(0).toUpperCase() + sanitizedName.slice(1)
							: "My Workspace";


						const randomSuffix = Math.floor(10000 + Math.random() * 90000);
						const orgSlug = `org-${randomSuffix}`;

						const org = await auth.api.createOrganization({
							body: {
								name: orgName,
								slug: orgSlug,
								userId: user.id,
							},
						});

						if (org) {
							await db
								.update(schema.user)
								.set({ activeOrganizationId: org.id })
								.where(eq(schema.user.id, user.id));

							logger.info(
								`Organization created: ${orgName} (${orgSlug}) for user ${user.email}`,
							);
						}
					} catch (error) {
						logger.error("Failed to create organization for user:", error);
					}
				},
			},
		},
		// Encrypt OAuth tokens before storing in database
		account: {
			create: {
				before: async (account) => {
					logger.debug("Encrypting OAuth tokens for account");
					return {
						data: {
							...account,
							// Encrypt sensitive OAuth tokens
							accessToken: account.accessToken
								? encryptField(account.accessToken)
								: account.accessToken,
							refreshToken: account.refreshToken
								? encryptField(account.refreshToken)
								: account.refreshToken,
							idToken: account.idToken
								? encryptField(account.idToken)
								: account.idToken,
						},
					};
				},
			},
			update: {
				before: async (account) => {
					logger.debug("Encrypting OAuth tokens for account update");
					return {
						data: {
							...account,
							// Encrypt sensitive OAuth tokens on update too
							accessToken: account.accessToken
								? encryptField(account.accessToken)
								: account.accessToken,
							refreshToken: account.refreshToken
								? encryptField(account.refreshToken)
								: account.refreshToken,
							idToken: account.idToken
								? encryptField(account.idToken)
								: account.idToken,
						},
					};
				},
			},
		},
	},
	basePath: "/api/auth/v1",
	telemetry: { enabled: false },
	emailAndPassword: {
		autoSignIn: true,
		enabled: true,
		sendResetPassword: async ({ user, url, token }) => {
			logger.info("Password reset requested for:", user.email);

			if (authConfig.NODE_ENV === "development") {
				logger.info("Reset URL (DEV):", url);
				logger.info("Token (DEV):", token);
			}

			try {
				await sendPasswordResetEmail(user.email, url);
				logger.info(`Password reset email sent to ${user.email}`);
			} catch (error) {
				logger.error("Failed to send password reset email:", error);
				throw new Error("Failed to send password reset email");
			}
		},
	},
	socialProviders: {
		...(authConfig.GOOGLE_CLIENT_ID && authConfig.GOOGLE_CLIENT_SECRET
			? {
				google: {
					clientId: authConfig.GOOGLE_CLIENT_ID,
					clientSecret: authConfig.GOOGLE_CLIENT_SECRET,
				},
			}
			: {}),
		...(authConfig.GITHUB_CLIENT_ID && authConfig.GITHUB_CLIENT_SECRET
			? {
				github: {
					clientId: authConfig.GITHUB_CLIENT_ID,
					clientSecret: authConfig.GITHUB_CLIENT_SECRET,
				},
			}
			: {}),
	},
	secret: authConfig.BETTER_AUTH_SECRET,
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24,
		freshAge: 60 * 10,
	},
	revokeOtherSessions: true,
	trustedOrigins: authConfig.isProduction
		? [
			"https://verifio.email",
			"https://www.verifio.email",
		]
		: [
			"http://localhost:3000",
			"http://localhost:3001",
			"https://local.verifio.email",
		],
	plugins: [
		jwt(),
		bearer(),
		admin(),
		apiKey({ defaultPrefix: "rl" }),
		organization({
			sendInvitationEmail: async (data) => {
				const inviteLink = `${authConfig.BASE_URL}/dashboard/accept-invitation?id=${data.id}`;

				logger.info("Organization invitation requested:", {
					email: data.email,
					organization: data.organization.name,
					role: data.role,
					inviter: data.inviter.user.email,
				});

				// Log invite URL in development for easy testing
				if (authConfig.NODE_ENV === "development") {
					logger.info("Invite URL (DEV):", inviteLink);
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
						`Organization invite email sent to ${data.email} using ${inviteLink}`,
					);
				} catch (error) {
					logger.error("Failed to send organization invite email:", error);
					throw new Error(`Failed to send invitation email to ${data.email}`);
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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
