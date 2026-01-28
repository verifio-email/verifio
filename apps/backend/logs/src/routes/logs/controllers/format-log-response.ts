import type { LogsTypes } from "@verifio/logs/types/logs.type";

export function formatLogResponse(row: LogsTypes.LogData): LogsTypes.LogEntry {
	return {
		id: row.id,
		user_id: row.userId,
		organization_id: row.organizationId,
		api_key_id: row.apiKeyId,
		service: row.service,
		endpoint: row.endpoint,
		method: row.method,
		resource_type: row.resourceType,
		resource_id: row.resourceId,
		status: row.status,
		result: row.result,
		error_message: row.errorMessage,
		credits_used: row.creditsUsed,
		duration_ms: row.durationMs,
		ip_address: row.ipAddress,
		user_agent: row.userAgent,
		metadata: row.metadata,
		created_at: row.createdAt.toISOString(),
	};
}
