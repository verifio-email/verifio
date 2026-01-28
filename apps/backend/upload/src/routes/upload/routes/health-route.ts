import { db } from "@verifio/db/client";
import { redis } from "@verifio/upload/lib/redis";
import { Elysia } from "elysia";

export const healthRoute = new Elysia().get(
	"/",
	async () => {
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
╔════════════════════════════════════════════════════════════════╗
║                        UPLOAD SERVICE                          ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║ ██╗   ██╗██████╗ ██╗      ██████╗  █████╗ ██████╗ ███████╗     ║
║ ██║   ██║██╔══██╗██║     ██╔═══██╗██╔══██╗██╔══██╗██╔════╝     ║
║ ██║   ██║██████╔╝██║     ██║   ██║███████║██║  ██║█████╗       ║
║ ██║   ██║██╔═══╝ ██║     ██║   ██║██╔══██║██║  ██║██╔══╝       ║
║ ╚██████╔╝██║     ███████╗╚██████╔╝██║  ██║██████╔╝███████╗     ║
║  ╚═════╝ ╚═╝     ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝     ║
║                                                                ║
║                          ONLINE & READY                        ║
║                         Version: v1.0.0                        ║
║                                                                ║
╠════════════════════════════════════════════════════════════════╣
║ DATABASE STATUS: ${dbStatus.padEnd(25)}                     ║
║ REDIS STATUS: ${redisStatus.padEnd(27)}                      ║
║                                                                ║
${dbError ? `║ DB ERROR: ${dbError.substring(0, 50).padEnd(50)} ║` : "║                                                                ║"}
${redisError ? `║ REDIS ERROR: ${redisError.substring(0, 50).padEnd(50)} ║` : "║                                                                ║"}
╠════════════════════════════════════════════════════════════════╣
║ RESOURCES:                                                     ║
║ - GitHub: https://github.com/verifio-email/verifio             ║
║ - Docs: https://verifio.email/dev/setup/backend/upload         ║
║ - Contact: https://verifio.email/contact                       ║
╠════════════════════════════════════════════════════════════════╣
║  "Store your images locally, serve them globally."             ║
║                    - Your Verifio Team                         ║
╚════════════════════════════════════════════════════════════════╝


    Powered by ☕ Coffee, 🍕 Pizza & 💻 Late Night Coding

                Made with ❤️ for developers

`;
	},
	{
		detail: {
			summary: "Upload Service",
			description: "Checks the health of the Upload Service",
		},
	},
);
