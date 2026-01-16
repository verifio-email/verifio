/**
 * Verify Service - Landing Route with Health Checks
 */

import { db } from "@verifio/db/client";
import { Elysia } from "elysia";

export const landing = new Elysia()
	.get(
		"/",
		async ({ set }) => {
			set.headers["Content-Type"] = "text/plain; charset=utf-8";

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
║                    VERIFY SERVICE                      ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║ ██╗   ██╗███████╗██████╗ ██╗███████╗██╗   ██╗         ║
║ ██║   ██║██╔════╝██╔══██╗██║██╔════╝╚██╗ ██╔╝         ║
║ ██║   ██║█████╗  ██████╔╝██║█████╗   ╚████╔╝          ║
║ ╚██╗ ██╔╝██╔══╝  ██╔══██╗██║██╔══╝    ╚██╔╝           ║
║  ╚████╔╝ ███████╗██║  ██║██║██║        ██║            ║
║   ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═╝╚═╝        ╚═╝            ║
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
║ curl -X POST /api/verify/v1/email \\                    ║
║   -H "Content-Type: application/json" \\                ║
║   -H "X-API-Key: your_api_key" \\                       ║
║   -d '{"email":"test@example.com"}'                    ║
╠════════════════════════════════════════════════════════╣
║ - SUPPORT                                              ║
║ - https://verifio.email/dev/setup/backend/verify       ║
║ - https://github.com/reloop-labs/verifio               ║
╠════════════════════════════════════════════════════════╣
║  "Verify every email, trust every inbox"               ║
║                    - Your Verifio Team                 ║
╚════════════════════════════════════════════════════════╝


    Powered by ☕ Coffee, 🍕 Pizza & 💻 Late Night Coding

                Made with ❤️ for developers

`;
		},
		{
			detail: {
				tags: ["Service"],
				summary: "Health check for Verify Service",
				description: "Checks the health of the Verify Service",
			},
		},
	)
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
