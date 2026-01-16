/**
 * Logs Service Entry Point
 */

import "dotenv/config";
import { cors } from "@elysiajs/cors";
import { fromTypes, openapi } from "@elysiajs/openapi";
import { serverTiming } from "@elysiajs/server-timing";
import { logger } from "@verifio/logger";
import { Elysia } from "elysia";
import { logsConfig } from "./config";
import { landingRoute } from "./routes/landing.route";
import { logRoute } from "./routes/log.route";
import { logsRoute } from "./routes/logs.route";
import { loader } from "./utils/loader";

const port = logsConfig.port;

const logsService = new Elysia({
	prefix: "/api/logs",
	name: "Logs Service",
})
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
	.use(landingRoute)
	.group("/v1", (app) => app.use(logRoute).use(logsRoute))
	.onStart(async () => {
		await loader();
	})
	.listen(port, () => {
		logger.info(`Logs Service running on http://localhost:${port}/api/logs`);
	});

export type LogsService = typeof logsService;
