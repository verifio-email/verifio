import {
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const activityLogs = pgTable("activity_logs", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id"),
	organizationId: text("organization_id").notNull(),
	apiKeyId: text("api_key_id"),
	service: text("service").notNull(),
	endpoint: text("endpoint").notNull(),
	method: text("method").notNull(),
	resourceType: text("resource_type"),
	resourceId: text("resource_id"),
	status: text("status").notNull(),
	result: text("result"),
	errorMessage: text("error_message"),
	creditsUsed: integer("credits_used").default(0),
	durationMs: integer("duration_ms"),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});
