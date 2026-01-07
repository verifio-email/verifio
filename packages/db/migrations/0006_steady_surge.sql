CREATE TABLE "credit_history" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"credits_used" integer NOT NULL,
	"credit_limit" integer NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "org_credits" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"credits_used" integer DEFAULT 0 NOT NULL,
	"credit_limit" integer DEFAULT 3000 NOT NULL,
	"period_start" timestamp DEFAULT now() NOT NULL,
	"period_end" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_job" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"upload_id" text,
	"name" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"total_emails" integer DEFAULT 0 NOT NULL,
	"processed_emails" integer DEFAULT 0 NOT NULL,
	"stats" jsonb,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "verification_result" (
	"id" text PRIMARY KEY NOT NULL,
	"job_id" text,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"email" text NOT NULL,
	"state" text NOT NULL,
	"score" integer NOT NULL,
	"reason" text NOT NULL,
	"result" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contact" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "domain" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "domain_dns_record" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "email_log" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "template" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "template_version" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "topic" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "topic_subscription" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "webhook" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "webhook_delivery" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "webhook_event" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "webhook_event_subscription" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "contact" CASCADE;--> statement-breakpoint
DROP TABLE "domain" CASCADE;--> statement-breakpoint
DROP TABLE "domain_dns_record" CASCADE;--> statement-breakpoint
DROP TABLE "email_log" CASCADE;--> statement-breakpoint
DROP TABLE "template" CASCADE;--> statement-breakpoint
DROP TABLE "template_version" CASCADE;--> statement-breakpoint
DROP TABLE "topic" CASCADE;--> statement-breakpoint
DROP TABLE "topic_subscription" CASCADE;--> statement-breakpoint
DROP TABLE "webhook" CASCADE;--> statement-breakpoint
DROP TABLE "webhook_delivery" CASCADE;--> statement-breakpoint
DROP TABLE "webhook_event" CASCADE;--> statement-breakpoint
DROP TABLE "webhook_event_subscription" CASCADE;--> statement-breakpoint
DROP INDEX "apikey_key_idx";--> statement-breakpoint
DROP INDEX "apikey_userId_idx";--> statement-breakpoint
DROP INDEX "apikey_organizationId_idx";--> statement-breakpoint
ALTER TABLE "credit_history" ADD CONSTRAINT "credit_history_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "org_credits" ADD CONSTRAINT "org_credits_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_job" ADD CONSTRAINT "verification_job_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_job" ADD CONSTRAINT "verification_job_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_job" ADD CONSTRAINT "verification_job_upload_id_upload_id_fk" FOREIGN KEY ("upload_id") REFERENCES "public"."upload"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_result" ADD CONSTRAINT "verification_result_job_id_verification_job_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."verification_job"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_result" ADD CONSTRAINT "verification_result_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_result" ADD CONSTRAINT "verification_result_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ch_idx_org_id" ON "credit_history" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "ch_idx_period_end" ON "credit_history" USING btree ("period_end");--> statement-breakpoint
CREATE UNIQUE INDEX "oc_idx_org_id" ON "org_credits" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "oc_idx_period_end" ON "org_credits" USING btree ("period_end");--> statement-breakpoint
CREATE INDEX "vj_idx_org_id" ON "verification_job" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "vj_idx_user_id" ON "verification_job" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "vj_idx_status" ON "verification_job" USING btree ("status");--> statement-breakpoint
CREATE INDEX "vj_idx_created_at" ON "verification_job" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "vr_idx_job_id" ON "verification_result" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "vr_idx_org_id" ON "verification_result" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "vr_idx_user_id" ON "verification_result" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "vr_idx_email" ON "verification_result" USING btree ("email");--> statement-breakpoint
CREATE INDEX "vr_idx_state" ON "verification_result" USING btree ("state");--> statement-breakpoint
CREATE INDEX "vr_idx_created_at" ON "verification_result" USING btree ("created_at");--> statement-breakpoint
DROP TYPE "public"."dns_record_type";--> statement-breakpoint
DROP TYPE "public"."dns_record_type_name";--> statement-breakpoint
DROP TYPE "public"."domain_status";--> statement-breakpoint
DROP TYPE "public"."domain_type";--> statement-breakpoint
DROP TYPE "public"."email_priority";--> statement-breakpoint
DROP TYPE "public"."email_status";--> statement-breakpoint
DROP TYPE "public"."template_block_type";--> statement-breakpoint
DROP TYPE "public"."template_status";--> statement-breakpoint
DROP TYPE "public"."subscription_status";--> statement-breakpoint
DROP TYPE "public"."webhook_delivery_status";--> statement-breakpoint
DROP TYPE "public"."webhook_status";