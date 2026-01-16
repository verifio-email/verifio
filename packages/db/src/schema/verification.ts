/**
 * Verification Schema
 * Tables for storing email verification jobs and results
 */

import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { organization, user } from "./auth";
import { upload } from "./upload";

// ID generators
const createJobId = () => `vj_${createId()}`;
const createResultId = () => `vr_${createId()}`;

/**
 * Verification status type
 */
export type VerificationJobStatus =
	| "pending"
	| "processing"
	| "completed"
	| "failed";

/**
 * Verification state type
 */
export type VerificationState =
	| "deliverable"
	| "undeliverable"
	| "risky"
	| "unknown";

/**
 * Bulk verification stats stored as JSON
 */
export interface BulkVerificationStatsJson {
	total: number;
	processed: number;
	deliverable: number;
	undeliverable: number;
	risky: number;
	unknown: number;
	breakdown: {
		disposable: number;
		roleBased: number;
		freeProvider: number;
		catchAll: number;
		syntaxErrors: number;
		dnsErrors: number;
		typosDetected: number;
	};
	averageScore: number;
	scoreDistribution: {
		excellent: number;
		good: number;
		fair: number;
		poor: number;
	};
	startedAt: string;
	completedAt: string | null;
	totalDuration: number;
	averageDuration: number;
}

/**
 * Verification Jobs Table
 * Tracks bulk verification jobs and their progress
 */
export const verificationJob = pgTable(
	"verification_job",
	{
		id: text("id")
			.$defaultFn(() => createJobId())
			.primaryKey(),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		uploadId: text("upload_id").references(() => upload.id, {
			onDelete: "set null",
		}),
		name: text("name"), // Optional job name (e.g., filename)
		status: text("status")
			.$type<VerificationJobStatus>()
			.notNull()
			.default("pending"),
		totalEmails: integer("total_emails").notNull().default(0),
		processedEmails: integer("processed_emails").notNull().default(0),
		stats: jsonb("stats").$type<BulkVerificationStatsJson>(),
		errorMessage: text("error_message"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		startedAt: timestamp("started_at"),
		completedAt: timestamp("completed_at"),
	},
	(table) => [
		index("vj_idx_org_id").on(table.organizationId),
		index("vj_idx_user_id").on(table.userId),
		index("vj_idx_status").on(table.status),
		index("vj_idx_created_at").on(table.createdAt),
	],
);

/**
 * Verification Results Table
 * Stores individual email verification results
 */
export const verificationResult = pgTable(
	"verification_result",
	{
		id: text("id")
			.$defaultFn(() => createResultId())
			.primaryKey(),
		jobId: text("job_id").references(() => verificationJob.id, {
			onDelete: "cascade",
		}),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		email: text("email").notNull(),
		state: text("state").$type<VerificationState>().notNull(),
		score: integer("score").notNull(),
		reason: text("reason").notNull(),
		// Full result JSON for deep analytics
		result: jsonb("result").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => [
		index("vr_idx_job_id").on(table.jobId),
		index("vr_idx_org_id").on(table.organizationId),
		index("vr_idx_user_id").on(table.userId),
		index("vr_idx_email").on(table.email),
		index("vr_idx_state").on(table.state),
		index("vr_idx_created_at").on(table.createdAt),
	],
);

/**
 * Relations
 */
export const verificationJobRelations = relations(
	verificationJob,
	({ one, many }) => ({
		organization: one(organization, {
			fields: [verificationJob.organizationId],
			references: [organization.id],
		}),
		user: one(user, {
			fields: [verificationJob.userId],
			references: [user.id],
		}),
		upload: one(upload, {
			fields: [verificationJob.uploadId],
			references: [upload.id],
		}),
		results: many(verificationResult),
	}),
);

export const verificationResultRelations = relations(
	verificationResult,
	({ one }) => ({
		job: one(verificationJob, {
			fields: [verificationResult.jobId],
			references: [verificationJob.id],
		}),
		organization: one(organization, {
			fields: [verificationResult.organizationId],
			references: [organization.id],
		}),
		user: one(user, {
			fields: [verificationResult.userId],
			references: [user.id],
		}),
	}),
);

/**
 * Export tables for use in other modules
 */
export const verificationTables = {
	verificationJob,
	verificationResult,
} as const;

export type VerificationTables = typeof verificationTables;
