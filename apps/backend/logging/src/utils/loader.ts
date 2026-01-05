import { logger } from "@verifio/logger";
import { checkConnection, ensureTableExists } from "./database";

export async function loader(): Promise<void> {
  logger.info("Initializing logging service...");

  // Check database connection
  const dbConnected = await checkConnection();
  if (!dbConnected) {
    logger.error("Failed to connect to PostgreSQL database");
    throw new Error("Database connection failed");
  }
  logger.info("PostgreSQL database connected");

  // Ensure table exists
  await ensureTableExists();
  logger.info("activity_logs table ready");

  logger.info("Logging service initialized successfully");
}
