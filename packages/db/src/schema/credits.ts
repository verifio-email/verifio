/**
 * Credits Schema
 * Tables for tracking org-level credit usage and history
 */

import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { organization } from "./auth";

// ID generators
const createCreditId = () => `cr_${createId()}`;
const createHistoryId = () => `ch_${createId()}`;

/**
 * Org Credits Table
 * Tracks current billing period credits for each organization
 * One record per organization (1:1 relationship)
 */
export const orgCredits = pgTable(
  "org_credits",
  {
    id: text("id")
      .$defaultFn(() => createCreditId())
      .primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    creditsUsed: integer("credits_used").notNull().default(0),
    creditLimit: integer("credit_limit").notNull().default(3000),
    periodStart: timestamp("period_start").notNull().defaultNow(),
    periodEnd: timestamp("period_end").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("oc_idx_org_id").on(table.organizationId),
    index("oc_idx_period_end").on(table.periodEnd),
  ],
);

/**
 * Credit History Table
 * Archives past billing periods for each organization
 */
export const creditHistory = pgTable(
  "credit_history",
  {
    id: text("id")
      .$defaultFn(() => createHistoryId())
      .primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    creditsUsed: integer("credits_used").notNull(),
    creditLimit: integer("credit_limit").notNull(),
    periodStart: timestamp("period_start").notNull(),
    periodEnd: timestamp("period_end").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("ch_idx_org_id").on(table.organizationId),
    index("ch_idx_period_end").on(table.periodEnd),
  ],
);

/**
 * Relations
 */
export const orgCreditsRelations = relations(orgCredits, ({ one }) => ({
  organization: one(organization, {
    fields: [orgCredits.organizationId],
    references: [organization.id],
  }),
}));

export const creditHistoryRelations = relations(creditHistory, ({ one }) => ({
  organization: one(organization, {
    fields: [creditHistory.organizationId],
    references: [organization.id],
  }),
}));

/**
 * Export tables for use in other modules
 */
export const creditTables = {
  orgCredits,
  creditHistory,
} as const;

export type CreditTables = typeof creditTables;
