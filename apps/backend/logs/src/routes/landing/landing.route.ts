import { Elysia } from "elysia";
import { checkConnection } from "../../utils/database";

export const landingRoute = new Elysia()
	.get(
		"/",
		async () => {
			return `
╔════════════════════════════════════════════════════════╗
║                  tracehub service                      ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║   ████████╗██████╗  █████╗  ██████╗███████╗██╗  ██╗   ║
║   ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██╔════╝██║  ██║   ║
║      ██║   ██████╔╝███████║██║     █████╗  ███████║   ║
║      ██║   ██╔══██╗██╔══██║██║     ██╔══╝  ██╔══██║   ║
║      ██║   ██║  ██║██║  ██║╚██████╗███████╗██║  ██║   ║
║      ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚══════╝╚═╝  ╚═╝   ║
║                                                        ║
║   ██╗  ██╗██╗   ██╗██████╗                            ║
║   ██║  ██║██║   ██║██╔══██╗                           ║
║   ███████║██║   ██║██████╔╝                           ║
║   ██╔══██║██║   ██║██╔══██╗                           ║
║   ██║  ██║╚██████╔╝██████╔╝                           ║
║   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝                            ║
║                                                        ║
║                  ONLINE & READY                        ║
║                 Version: v1.0.0                        ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║ QUICK START:                                           ║
║ curl -X POST /api/tracehub/v1/track \\                  ║
║   -H "Content-Type: application/json" \\                ║
║   -d '{"event":"page_viewed","properties":{"page":"/home"}}' ║
╠════════════════════════════════════════════════════════╣
║ - SUPPORT                                              ║
║ - https://verifio.email/dev/setup/backend/tracehub        ║
║ - https://github.com/reloop-labs/verifio               ║
╚════════════════════════════════════════════════════════╝


    Powered by ☕ Coffee, 🍕 Pizza & 💻 Late Night Coding

                Made with ❤️ for developers

`;
		},
		{
			detail: {
				tags: ["Service"],
				summary: "Landing page for tracehub service",
				description: "Displays the landing page for the tracehub service",
			},
		},
	)
	.get(
		"/health/db",
		async () => {
			try {
				const startTime = Date.now();
				const isConnected = await checkConnection();
				const responseTime = Date.now() - startTime;

				if (isConnected) {
					return {
						status: "CONNECTED",
						database: "postgresql",
						responseTime: `${responseTime}ms`,
						timestamp: new Date().toISOString(),
					};
				}

				return {
					status: "DISCONNECTED",
					database: "postgresql",
					error: "Connection check failed",
					timestamp: new Date().toISOString(),
				};
			} catch (error) {
				return {
					status: "DISCONNECTED",
					database: "postgresql",
					error: error instanceof Error ? error.message : String(error),
					timestamp: new Date().toISOString(),
				};
			}
		},
		{
			detail: {
				tags: ["Service"],
				summary: "Health check for PostgreSQL database",
				description: "Checks the health of the PostgreSQL database connection",
			},
		},
	);

