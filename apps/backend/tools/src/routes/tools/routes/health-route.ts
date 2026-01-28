import { redis } from "@verifio/tools/lib/redis";
import { Elysia } from "elysia";

export const healthRoute = new Elysia().get(
	"/",
	async () => {
		let redisStatus = "UNKNOWN";
		let redisError = "";

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
║                      TOOLS                             ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║    ████████╗ ██████╗  ██████╗ ██╗     ███████╗         ║
║    ╚══██╔══╝██╔═══██╗██╔═══██╗██║     ██╔════╝         ║
║       ██║   ██║   ██║██║   ██║██║     ███████╗         ║
║       ██║   ██║   ██║██║   ██║██║     ╚════██║         ║
║       ██║   ╚██████╔╝╚██████╔╝███████╗███████║         ║
║       ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝╚══════╝         ║
║                                                        ║
║                  ONLINE & READY                        ║
║                 Version: v1.0.0                        ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║ REDIS STATUS: ${redisStatus.padEnd(27)}              ║
║                                                        ║
${redisError ? `║ REDIS ERROR: ${redisError.substring(0, 50).padEnd(50)} ║` : "║                                                        ║"}
╠════════════════════════════════════════════════════════╣
╠════════════════════════════════════════════════════════╣
║ AVAILABLE TOOLS:                                       ║
║ - https://verifio.email/email-syntax-validator         ║
║ - https://verifio.email/disposable-email-checker       ║
║ - https://verifio.email/email-deliverability-test      ║
║ - https://verifio.email/email-list-health-checker      ║
║ - https://verifio.email/catch-all-detector             ║
╠════════════════════════════════════════════════════════╣
║ RESOURCES:                                             ║
║ - GitHub: https://github.com/verifio-email/verifio     ║
║ - Docs: https://verifio.email/dev/tools               ║
║ - Contact: https://verifio.email/contact               ║
╠════════════════════════════════════════════════════════╣
║  "Free tools for email verification"                   ║
║                    - Your Verifio Team                 ║
╚════════════════════════════════════════════════════════╝


    Powered by ☕ Coffee, 🍕 Pizza & 💻 Late Night Coding

                Made with ❤️ for developers

`;
	},
	{
		detail: {
			summary: "Tools Service",
			description: "Health check endpoint for Tools Service",
		},
	},
);
