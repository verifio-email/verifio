/**
 * Credits Service Entry Point
 */

import "dotenv/config";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { serverTiming } from "@elysiajs/server-timing";
import { creditsRoutes } from "@verifio/credits/routes/credits/credits.routes";
import { healthRoute } from "@verifio/credits/routes/credits/routes/health-route";
import { loader } from "@verifio/credits/utils/loader";
import { logger } from "@verifio/logger";
import { Elysia } from "elysia";
import { creditsConfig } from "./credits.config";

const port = creditsConfig.port;

const creditsService = new Elysia({
	prefix: "/api/credits",
	name: "Credits Service",
})
	.use(
		cors({
			origin:
				creditsConfig.isProduction
					? ["https://verifio.email", "https://www.verifio.email"]
					: [
						"http://localhost:3000",
						"http://localhost:3001",
						"https://local.verifio.email",
					],
			methods: ["GET", "POST", "OPTIONS"],
			allowedHeaders: [
				"Content-Type",
				"X-API-Key",
				"Authorization",
				"Cookie",
				"X-Internal-Secret",
			],
			credentials: true,
		}),
	)
	.use(openapi())
	.use(serverTiming())
	.use(healthRoute)
	.use(creditsRoutes)
	.onStart(async () => {
		await loader();
	})
	.listen(port, () => {
		logger.info(
			`Credits Service running on http://localhost:${port}/api/credits`,
		);
	});

export type CreditsService = typeof creditsService;
