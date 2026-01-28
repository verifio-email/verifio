/**
 * Tools Service Entry Point
 */

import "dotenv/config";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { serverTiming } from "@elysiajs/server-timing";
import { logger } from "@verifio/logger";
import { healthRoute } from "@verifio/tools/routes/tools/routes/health-route";
import { toolsRoutes } from "@verifio/tools/routes/tools/tools.routes";
import { toolsConfig } from "@verifio/tools/tools.config";
import { loader } from "@verifio/tools/utils/loader";
import { Elysia } from "elysia";

const port = toolsConfig.port;

const toolsService = new Elysia({
	prefix: "/api/tools",
	name: "Tools Service",
})
	.use(
		cors({
			origin: toolsConfig.isProduction
				? ["https://verifio.email", "https://www.verifio.email"]
				: toolsConfig.allowedOrigins,
			methods: ["GET", "POST", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}),
	)
	.use(openapi())
	.use(serverTiming())
	.use(healthRoute)
	.use(toolsRoutes)
	.onStart(async () => {
		await loader();
	})
	.listen(
		{
			port,
			development: !toolsConfig.isProduction,
			requestTimeout: 30000,
		},
		() => {
			logger.info(
				`Tools Service running on http://localhost:${port}/api/tools`,
			);
		},
	);

export type ToolsService = typeof toolsService;
