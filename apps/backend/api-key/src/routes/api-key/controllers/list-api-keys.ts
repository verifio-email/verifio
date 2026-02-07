import { formatApiKeyResponse } from "@verifio/api-key/routes/api-key/controllers/format-api-key-response";
import type { ApiKeyTypes } from "@verifio/api-key/types/api-key.type";
import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { logger } from "@verifio/logger";
import { and, count, desc, eq, isNull } from "drizzle-orm";

interface OrganizationInfo {
	id: string;
	name: string;
	slug: string;
}

export async function listApiKeys(
	query: ApiKeyTypes.ApiKeyListQuery,
	organizationId: string,
): Promise<ApiKeyTypes.ApiKeyListResponse> {
	const { page = 1, limit = 10, enabled } = query;
	const offset = (page - 1) * limit;

	try {
		const organizationsMap: Map<string, OrganizationInfo> = new Map();

		// Get organization details
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

		const conditions = [
			eq(schema.apikey.organizationId, organizationId),
			isNull(schema.apikey.deletedAt),
		];
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
		const result = await listApiKeys(query, organizationId);
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
