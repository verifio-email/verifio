/**
 * Logging Service - Landing Route with Health Checks
 */

import { db } from "@verifio/db/client";
import { Elysia } from "elysia";

export const landingRoute = new Elysia()
  .get("/", async () => {
    let dbStatus = "UNKNOWN";
    let dbError = "";

    try {
      await db.execute("SELECT 1 as test");
      dbStatus = "CONNECTED";
    } catch (dbErr) {
      dbStatus = "DISCONNECTED";
      dbError = dbErr instanceof Error ? dbErr.message : String(dbErr);
    }

    return `
╔════════════════════════════════════════════════════════╗
║                   LOGGING SERVICE                      ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║ ██╗      ██████╗  ██████╗  ██████╗ ██╗███╗   ██╗ ██████╗║
║ ██║     ██╔═══██╗██╔════╝ ██╔════╝ ██║████╗  ██║██╔════╝║
║ ██║     ██║   ██║██║  ███╗██║  ███╗██║██╔██╗ ██║██║  ███╗
║ ██║     ██║   ██║██║   ██║██║   ██║██║██║╚██╗██║██║   ██║
║ ███████╗╚██████╔╝╚██████╔╝╚██████╔╝██║██║ ╚████║╚██████╔╝
║ ╚══════╝ ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝║
║                                                        ║
║                  ONLINE & READY                        ║
║                 Version: v1.0.0                        ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║ DATABASE STATUS: ${dbStatus.padEnd(25)}             ║
║                                                        ║
${dbError ? `║ DB ERROR: ${dbError.substring(0, 45).padEnd(45)} ║` : "║                                                        ║"}
╠════════════════════════════════════════════════════════╣
║ QUICK START:                                           ║
║ curl -X GET /api/logging/v1/logs \\                     ║
║   -H "Cookie: session=your_session_token" \\            ║
║   -G -d "organization_id=org_xxx"                      ║
╠════════════════════════════════════════════════════════╣
║ - SUPPORT                                              ║
║ - https://verifio.email/dev/setup/backend/logging      ║
║ - https://github.com/reloop-labs/verifio               ║
╠════════════════════════════════════════════════════════╣
║  "Log everything, miss nothing"                        ║
║                    - Your Verifio Team                 ║
╚════════════════════════════════════════════════════════╝


    Powered by ☕ Coffee, 🍕 Pizza & 💻 Late Night Coding

                Made with ❤️ for developers

`;
  })
  .get("/health/postgres", async () => {
    try {
      await db.execute("SELECT 1 as test");
      return {
        status: "CONNECTED",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: "DISCONNECTED",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      };
    }
  });
