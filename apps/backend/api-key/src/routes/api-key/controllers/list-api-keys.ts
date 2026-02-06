import { formatApiKeyResponse } from "@verifio/api-key/routes/api-key/controllers/format-api-key-response";
import type { ApiKeyTypes } from "@verifio/api-key/types/api-key.type";
import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { logger } from "@verifio/logger";
import { and, count, desc, eq, inArray } from "drizzle-orm";

interface OrganizationInfo {
	id: string;
	name: string;
	slug: string;
}

export async function listApiKeys(
	query: ApiKeyTypes.ApiKeyListQuery,
	organizationId: string,
	userId: string,
): Promise<ApiKeyTypes.ApiKeyListResponse> {
	const { page = 1, limit = 10, enabled, allOrgs } = query;
	const offset = (page - 1) * limit;

	try {
		let organizationIds: string[] = [organizationId];
		const organizationsMap: Map<string, OrganizationInfo> = new Map();

		// If allOrgs is true, get all organizations the user is a member of
		if (allOrgs) {
			const userMemberships = await db.query.member.findMany({
				where: eq(schema.member.userId, userId),
				with: { organization: true },
			});

			organizationIds = userMemberships.map((m) => m.organizationId);

			// Build organizations map for response
			for (const membership of userMemberships) {
				if (membership.organization) {
					organizationsMap.set(membership.organizationId, {
						id: membership.organization.id,
						name: membership.organization.name,
						slug: membership.organization.slug,
					});
				}
			}

			// If user has no memberships, return empty
			if (organizationIds.length === 0) {
				return {
					apiKeys: [],
					total: 0,
					page,
					limit,
				};
			}
		} else {
			// Get organization details for single org case
			const org = await db.query.organization.findFirst({
				where: eq(schema.organization.id, organizationId),
			});
			if (org) {
				organizationsMap.set(organizationId, {
					id: org.id,
					name: org.name,
					slug: org.slug,
				});
			}
		}

		const conditions = [inArray(schema.apikey.organizationId, organizationIds)];
		if (enabled !== undefined) {
			conditions.push(eq(schema.apikey.enabled, enabled));
		}
		const whereClause = and(...conditions);

		const totalResult = await db
			.select({ count: count() })
			.from(schema.apikey)
			.where(whereClause);
		const total = totalResult[0]?.count || 0;

		const result = await db.query.apikey.findMany({
			where: whereClause,
			orderBy: desc(schema.apikey.createdAt),
			limit: limit,
			offset: offset,
			with: { user: true },
		});

		return {
			apiKeys: result.map((apiKey) => {
				const { user, ...apiKeyData } = apiKey;
				const orgInfo = organizationsMap.get(apiKey.organizationId);
				return {
					...formatApiKeyResponse({
						...apiKeyData,
						createdBy: {
							id: user.id,
							name: user.name,
							image: user.image,
							email: user.email,
						},
					}),
					organization: orgInfo,
				};
			}),
			total,
			page,
			limit,
		};
	} catch (error) {
		logger.error(
			{
				query,
				error: error instanceof Error ? error.message : String(error),
			},
			"Error listing API keys",
		);
		throw error;
	}
}

export async function listApiKeysHandler(
	query: ApiKeyTypes.ApiKeyListQuery,
	organizationId: string,
	userId: string,
): Promise<ApiKeyTypes.ApiKeyListResponse> {
	logger.info({ query, organizationId, userId }, "Listing API keys");

	try {
		const result = await listApiKeys(query, organizationId, userId);
		logger.info(
			{ query, organizationId, userId },
			"API keys listed successfully",
		);
		return result;
	} catch (error) {
		logger.error(
			{
				query,
				organizationId,
				userId,
				error: error instanceof Error ? error.message : String(error),
			},
			"Error listing API keys",
		);
		throw error;
	}
}
