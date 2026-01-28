import type { LogsModel } from "@verifio/logs/model/logs.model";

export namespace LogsTypes {
  export type LogBody = typeof LogsModel.logBody.static;
  export type LogResponse = typeof LogsModel.logResponse.static;
  export type LogsQuery = typeof LogsModel.logsQuery.static;
  export type LogEntry = typeof LogsModel.logEntry.static;
  export type LogsResponse = typeof LogsModel.logsResponse.static;
  export type ErrorResponse = typeof LogsModel.errorResponse.static;
  export type Unauthorized = typeof LogsModel.unauthorized.static;
  export type HealthResponse = typeof LogsModel.healthResponse.static;

  export interface LogData {
    id: string;
    userId: string | null;
    organizationId: string;
    apiKeyId: string | null;
    service: string;
    endpoint: string;
    method: string;
    resourceType: string | null;
    resourceId: string | null;
    status: string;
    result: string | null;
    errorMessage: string | null;
    creditsUsed: number | null;
    durationMs: number | null;
    ipAddress: string | null;
    userAgent: string | null;
    metadata: unknown;
    createdAt: Date;
  }

  export interface CreateLogRequest {
    user_id?: string;
    organization_id: string;
    api_key_id?: string;
    service: string;
    endpoint: string;
    method: string;
    resource_type?: string;
    resource_id?: string;
    status: string;
    result?: string;
    error_message?: string;
    credits_used?: number;
    duration_ms?: number;
    ip_address?: string;
    user_agent?: string;
    metadata?: Record<string, unknown>;
  }

  export interface ListLogsRequest {
    organization_id: string;
    api_key_id?: string;
    service?: string;
    endpoint?: string;
    status?: string;
    from?: string;
    to?: string;
    search?: string;
    page?: number;
    limit?: number;
  }

  export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  }
}
