/**
 * Activity logging types
 */

export type Service =
	| "verify"
	| "api-key"
	| "auth"
	| "upload"
	| "logs"
	| "credits"
	| "tools";

export type Status = "success" | "failed" | "error";

export interface LogActivityParams {
	// Service context
	service: Service;
	endpoint: string;
	method: string;

	// Identity
	organization_id: string;
	user_id?: string;
	api_key_id?: string;

	// Request data
	resource_type?: string;
	resource_id?: string;

	// Result
	status: Status;
	result?: string;
	error_message?: string;

	// Metrics
	credits_used?: number;
	duration_ms?: number;

	// Client info
	ip_address?: string;
	user_agent?: string;

	// Extra data
	metadata?: Record<string, unknown>;
}

// Re-export as alias
export type ActivityLogParams = LogActivityParams;
