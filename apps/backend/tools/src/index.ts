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
			origin:
				toolsConfig.NODE_ENV === "production"
					? ["https://verifio.email", "https://www.verifio.email"]
					: [
							"http://localhost:3000",
							"http://localhost:3001",
							"http://localhost:3002",
							"http://localhost:3004",
						],
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
			development: toolsConfig.NODE_ENV !== "production",
			requestTimeout: 30000,
		},
		() => {
			logger.info(
				`Tools Service running on http://localhost:${port}/api/tools`,
			);
		},
	);

export type ToolsService = typeof toolsService;
