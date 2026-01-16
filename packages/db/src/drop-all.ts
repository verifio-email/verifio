import { sql } from "drizzle-orm";
import { db } from "./client";

async function dropAll() {
	console.log("Dropping all tables...");

	// Drop all tables in the public schema
	await db.execute(sql`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;
    END $$;
  `);

	console.log("All tables dropped successfully!");
	process.exit(0);
}

dropAll().catch((err) => {
	console.error("Error:", err);
	process.exit(1);
});
