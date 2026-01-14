import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { eq } from "drizzle-orm";
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
import { authConfig } from "../auth.config";
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

					setTimeout(async () => {
						try {
							const username = user.email.split("@")[0] || "workspace";
							const orgName =
								username.charAt(0).toUpperCase() + username.slice(1);
							const randomSuffix = Math.floor(10000 + Math.random() * 90000);
							const orgSlug = `org-${randomSuffix}`;

							console.log("=".repeat(50));
							console.log("CREATING ORGANIZATION FOR NEW USER");
							console.log("User:", user.email);
							console.log("Org Name:", orgName, "Slug:", orgSlug);
							console.log("=".repeat(50));
							const org = await auth.api.createOrganization({
								body: {
									name: orgName,
									slug: orgSlug,
									userId: user.id,
								},
							});

							console.log("Organization created:", org);

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
							console.error("Organization creation error:", error);
						}
					}, 100);
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

			// Log reset URL and token only in development for easy testing
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
