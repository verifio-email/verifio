import "dotenv/config";
import { cors } from "@elysiajs/cors";
import { fromTypes, openapi } from "@elysiajs/openapi";
import { serverTiming } from "@elysiajs/server-timing";
import { logger } from "@verifio/logger";
import { logsRoutes } from "@verifio/logs/routes/logs/logs.routes";
import { healthRoute } from "@verifio/logs/routes/logs/routes/health-route";
import { loader } from "@verifio/logs/utils/loader";
import { Elysia } from "elysia";
import { logsConfig } from "./logs.config";

const port = logsConfig.port;

const logsService = new Elysia({
	prefix: "/api/logs",
	name: "Logs Service",
})
	.use(
		cors({
			origin:
				logsConfig.NODE_ENV === "production"
					? ["https://verifio.email", "https://www.verifio.email"]
					: [
						"http://localhost:3000",
						"http://localhost:3001",
						"https://local.verifio.email",
					],
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
			credentials: true,
		}),
	)
	.use(
		openapi({
			documentation: {
				info: {
					title: "Verifio Logs API",
					version: "1.0.0",
					description: "Centralized activity logs for Verifio services",
				},
				tags: [
					{
						name: "Logs",
						description: "Activity log endpoints",
					},
					{
						name: "Health",
						description: "Health check endpoints",
					},
				],
			},
			references: fromTypes(
				logsConfig.NODE_ENV === "production"
					? "dist/index.d.ts"
					: "src/index.ts",
			),
		}),
	)
	.use(serverTiming())
	.use(healthRoute)
	.use(logsRoutes)
	.onStart(async () => {
		await loader();
	})
	.listen(port, () => {
		logger.info(`Logs Service running on http://localhost:${port}/api/logs`);
	});

export type LogsService = typeof logsService;
