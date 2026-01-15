import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { logsConfig } from "../config";

// Activity logs table schema
export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Identity
  userId: text("user_id"),
  organizationId: text("organization_id").notNull(),
  apiKeyId: text("api_key_id"),

  // Service Context
  service: text("service").notNull(), // 'verify', 'api-key', 'auth', 'workflow', 'upload'
  endpoint: text("endpoint").notNull(),
  method: text("method").notNull(),

  // Request Data
  resourceType: text("resource_type"),
  resourceId: text("resource_id"),

  // Result
  status: text("status").notNull(), // 'success', 'failed', 'error'
  result: text("result"),
  errorMessage: text("error_message"),

  // Metrics
  creditsUsed: integer("credits_used").default(0),
  durationMs: integer("duration_ms"),

  // Client Info
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),

  // Metadata
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),

  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Database instance
let dbInstance: NodePgDatabase | null = null;

export function getDb(): NodePgDatabase {
  if (!dbInstance) {
    dbInstance = drizzle({
      connection: {
        connectionString: logsConfig.PG_URL,
      },
    });
  }
  return dbInstance;
}

export async function ensureTableExists(): Promise<void> {
  const db = getDb();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      
      -- Identity
      user_id TEXT,
      organization_id TEXT NOT NULL,
      api_key_id TEXT,
      
      -- Service Context
      service TEXT NOT NULL,
      endpoint TEXT NOT NULL,
      method TEXT NOT NULL,
      
      -- Request Data
      resource_type TEXT,
      resource_id TEXT,
      
      -- Result
      status TEXT NOT NULL,
      result TEXT,
      error_message TEXT,
      
      -- Metrics
      credits_used INTEGER DEFAULT 0,
      duration_ms INTEGER,
      
      -- Client Info
      ip_address TEXT,
      user_agent TEXT,
      
      -- Metadata
      metadata JSONB DEFAULT '{}',
      
      -- Timestamps
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );
    
    -- Indexes for common queries
    CREATE INDEX IF NOT EXISTS idx_activity_logs_org_id ON activity_logs (organization_id);
    CREATE INDEX IF NOT EXISTS idx_activity_logs_org_created ON activity_logs (organization_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_activity_logs_service ON activity_logs (service);
    CREATE INDEX IF NOT EXISTS idx_activity_logs_endpoint ON activity_logs (endpoint);
    CREATE INDEX IF NOT EXISTS idx_activity_logs_status ON activity_logs (status);
  `);
}

export async function checkConnection(): Promise<boolean> {
  try {
    const db = getDb();
    await db.execute("SELECT 1 as test");
    return true;
  } catch {
    return false;
  }
}
