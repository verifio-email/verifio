import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { logger } from "@verifio/logger";
import { formatLogResponse } from "@verifio/logs/routes/logs/controllers/format-log-response";
import type { LogsTypes } from "@verifio/logs/types/logs.type";
import { and, desc, eq, gte, ilike, lte, sql } from "drizzle-orm";
import { status } from "elysia";

export async function listLogs(
  query: LogsTypes.ListLogsRequest,
): Promise<LogsTypes.LogsResponse> {
  const page = query.page || 1;
  const limit = query.limit || 20;
  const offset = (page - 1) * limit;

  const conditions = [
    eq(schema.activityLogs.organizationId, query.organization_id),
  ];

  if (query.api_key_id) {
    conditions.push(eq(schema.activityLogs.apiKeyId, query.api_key_id));
  }
  if (query.service) {
    conditions.push(eq(schema.activityLogs.service, query.service));
  }
  if (query.endpoint) {
    conditions.push(eq(schema.activityLogs.endpoint, query.endpoint));
  }
  if (query.status) {
    conditions.push(eq(schema.activityLogs.status, query.status));
  }
  if (query.from) {
    conditions.push(gte(schema.activityLogs.createdAt, new Date(query.from)));
  }
  if (query.to) {
    conditions.push(lte(schema.activityLogs.createdAt, new Date(query.to)));
  }
  if (query.search) {
    conditions.push(ilike(schema.activityLogs.resourceId, `%${query.search}%`));
  }

  const whereClause = and(...conditions);

  const [countResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.activityLogs)
    .where(whereClause);

  const total = countResult?.count || 0;

  const results = await db
    .select()
    .from(schema.activityLogs)
    .where(whereClause)
    .orderBy(desc(schema.activityLogs.createdAt))
    .limit(limit)
    .offset(offset);

  logger.debug(
    { organizationId: query.organization_id, page, limit, total },
    "Activity logs queried",
  );

  return {
    success: true,
    data: results.map((row) => formatLogResponse(row)),
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
}

export async function listLogsHandler(
  query: LogsTypes.ListLogsRequest,
): Promise<LogsTypes.LogsResponse> {
  try {
    return await listLogs(query);
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : "Unknown error" },
      "Failed to query activity logs",
    );

    throw status(500, {
      success: false,
      message: error instanceof Error ? error.message : "Failed to query logs",
    });
  }
}
