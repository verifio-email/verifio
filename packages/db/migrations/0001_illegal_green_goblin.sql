CREATE TABLE "activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"organization_id" text NOT NULL,
	"api_key_id" text,
	"service" text NOT NULL,
	"endpoint" text NOT NULL,
	"method" text NOT NULL,
	"resource_type" text,
	"resource_id" text,
	"status" text NOT NULL,
	"result" text,
	"error_message" text,
	"credits_used" integer DEFAULT 0,
	"duration_ms" integer,
	"ip_address" text,
	"user_agent" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "apikey" ADD COLUMN "encrypted_key" text;--> statement-breakpoint
ALTER TABLE "apikey" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "upload" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
CREATE INDEX "upload_idx_organization_id" ON "upload" USING btree ("organization_id");