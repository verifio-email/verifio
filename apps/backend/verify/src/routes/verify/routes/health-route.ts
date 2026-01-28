import { db } from "@verifio/db/client";
import { Elysia } from "elysia";
import { redis } from "../../../lib/redis";

export const healthRoute = new Elysia().get("/", async ({ set }) => {
	set.headers["Content-Type"] = "text/plain; charset=utf-8";

	let dbStatus = "UNKNOWN";
	let dbError = "";
	let redisStatus = "UNKNOWN";
	let redisError = "";

	try {
		await db.execute("SELECT 1 as test");
		dbStatus = "CONNECTED";
	} catch (dbErr) {
		dbStatus = "DISCONNECTED";
		dbError = dbErr instanceof Error ? dbErr.message : String(dbErr);
	}

	try {
		await redis.healthCheck();
		redisStatus = "CONNECTED";
	} catch (redisErr) {
		redisStatus = "DISCONNECTED";
		redisError =
			redisErr instanceof Error ? redisErr.message : String(redisErr);
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
${dbError ? `║ DB ERROR: ${dbError.substring(0, 45).padEnd(45)} ║` : "║                                                        ║"}
╠════════════════════════════════════════════════════════╣
║ REDIS STATUS: ${redisStatus.padEnd(28)}             ║
${redisError ? `║ REDIS ERROR: ${redisError.substring(0, 42).padEnd(42)} ║` : "║                                                        ║"}
╠════════════════════════════════════════════════════════╣
║ QUICK START:                                           ║
║ curl -X POST /api/verify/v1/verify \\                  ║
║   -H "Content-Type: application/json" \\               ║
║   -H "Authorization: Bearer YOUR_TOKEN" \\             ║
║   -d '{"email":"test@example.com"}'                   ║
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
});
