import { t } from "elysia";

export namespace LoggingModel {
	// POST /v1/log request body
	export const logBody = t.Object({
		// Identity
		user_id: t.Optional(t.String({ description: "User identifier" })),
		organization_id: t.String({ description: "Organization identifier" }),
		api_key_id: t.Optional(t.String({ description: "API key identifier" })),

		// Service Context
		service: t.String({
			description: "Service name: 'verify', 'api-key', 'auth', 'upload'",
		}),
		endpoint: t.String({ description: "API endpoint path" }),
		method: t.String({ description: "HTTP method" }),

		// Request Data
		resource_type: t.Optional(t.String({ description: "Type of resource" })),
		resource_id: t.Optional(
			t.String({ description: "ID or value of the resource" }),
		),

		// Result
		status: t.String({ description: "'success', 'failed', or 'error'" }),
		result: t.Optional(t.String({ description: "Detailed result" })),
		error_message: t.Optional(
			t.String({ description: "Error message if failed" }),
		),

		// Metrics
		credits_used: t.Optional(t.Number({ description: "Credits consumed" })),
		duration_ms: t.Optional(
			t.Number({ description: "Request duration in ms" }),
		),

		// Client Info
		ip_address: t.Optional(t.String({ description: "Client IP address" })),
		user_agent: t.Optional(t.String({ description: "Client user agent" })),

		// Metadata
		metadata: t.Optional(
			t.Record(t.String(), t.Unknown(), {
				description: "Additional metadata",
			}),
		),
	});

	export type LogBody = typeof logBody.static;

	// POST /v1/log response
	export const logResponse = t.Object({
		success: t.Boolean(),
		id: t.String({ description: "Created log entry ID" }),
	});

	export type LogResponse = typeof logResponse.static;

	// GET /v1/logs query parameters
	export const logsQuery = t.Object({
		organization_id: t.String({ description: "Organization ID (required)" }),
		api_key_id: t.Optional(t.String({ description: "Filter by API key ID" })),
		service: t.Optional(t.String({ description: "Filter by service" })),
		endpoint: t.Optional(t.String({ description: "Filter by endpoint" })),
		status: t.Optional(t.String({ description: "Filter by status" })),
		from: t.Optional(t.String({ description: "Start date (ISO 8601)" })),
		to: t.Optional(t.String({ description: "End date (ISO 8601)" })),
		search: t.Optional(t.String({ description: "Search in resource_id" })),
		page: t.Optional(t.Numeric({ minimum: 1, default: 1 })),
		limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 20 })),
	});

	export type LogsQuery = typeof logsQuery.static;

	// GET /v1/logs response
	export const logsResponse = t.Object({
		success: t.Boolean(),
		data: t.Array(
			t.Object({
				id: t.String(),
				user_id: t.Nullable(t.String()),
				organization_id: t.String(),
				api_key_id: t.Nullable(t.String()),
				service: t.String(),
				endpoint: t.String(),
				method: t.String(),
				resource_type: t.Nullable(t.String()),
				resource_id: t.Nullable(t.String()),
				status: t.String(),
				result: t.Nullable(t.String()),
				error_message: t.Nullable(t.String()),
				credits_used: t.Nullable(t.Number()),
				duration_ms: t.Nullable(t.Number()),
				ip_address: t.Nullable(t.String()),
				user_agent: t.Nullable(t.String()),
				metadata: t.Unknown(),
				created_at: t.String(),
			}),
		),
		pagination: t.Object({
			page: t.Number(),
			limit: t.Number(),
			total: t.Number(),
			total_pages: t.Number(),
		}),
	});

	export type LogsResponse = typeof logsResponse.static;

	// Error response
	export const errorResponse = t.Object({
		success: t.Literal(false),
		message: t.String({ description: "Error message" }),
	});

	export type ErrorResponse = typeof errorResponse.static;
}
