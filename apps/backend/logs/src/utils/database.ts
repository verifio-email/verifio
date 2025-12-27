import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { logsConfig } from "../logs.config";

// Events table schema
export const events = pgTable("tracehub_events", {
  id: text("id").primaryKey(),
  event: text("event").notNull(),
  userId: text("user_id").notNull(),
  distinctId: text("distinct_id").notNull(),
  organizationId: text("organization_id"),
  properties: jsonb("properties").$type<Record<string, string | number>>(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
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

  // Create table if not exists using raw SQL
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tracehub_events (
      id TEXT PRIMARY KEY,
      event TEXT NOT NULL,
      user_id TEXT NOT NULL,
      distinct_id TEXT NOT NULL,
      organization_id TEXT,
      properties JSONB,
      timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );
    
    -- Create index for common queries
    CREATE INDEX IF NOT EXISTS idx_tracehub_events_timestamp ON tracehub_events (timestamp DESC);
    CREATE INDEX IF NOT EXISTS idx_tracehub_events_event ON tracehub_events (event);
    CREATE INDEX IF NOT EXISTS idx_tracehub_events_user_id ON tracehub_events (user_id);
    CREATE INDEX IF NOT EXISTS idx_tracehub_events_org_id ON tracehub_events (organization_id);
  `);
}

export async function insertEvent(
  event: string,
  userId: string,
  distinctId: string,
  properties: Record<string, string | number>,
  organizationId?: string | null,
): Promise<string> {
  const db = getDb();
  const uuid = crypto.randomUUID();

  await db.insert(events).values({
    id: uuid,
    event,
    userId,
    distinctId,
    organizationId: organizationId || null,
    properties,
  });

  return uuid;
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
