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
	service: Service;
	endpoint: string;
	method: string;

	organization_id: string;
	user_id?: string;
	api_key_id?: string;

	resource_type?: string;
	resource_id?: string;

	status: Status;
	result?: string;
	error_message?: string;

	credits_used?: number;
	duration_ms?: number;

	ip_address?: string;
	user_agent?: string;

	metadata?: Record<string, unknown>;
}

export type ActivityLogParams = LogActivityParams;

export interface LogActivityOptions {
	cookie?: string;
}
