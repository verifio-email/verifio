/**
 * Credits Service Entry Point
 */

import "dotenv/config";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { serverTiming } from "@elysiajs/server-timing";
import { logger } from "@verifio/logger";
import { Elysia } from "elysia";
import { creditsConfig } from "./credits.config";
import { creditsRoute } from "./routes/credits";
import { internalRoute } from "./routes/internal";
import { landing } from "./routes/landing";

const port = creditsConfig.port;

const creditsService = new Elysia({
	prefix: "/api/credits",
	name: "Credits Service",
})
	.use(
		cors({
			origin: true,
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
	.use(
		openapi({
			documentation: {
				info: {
					title: "Verifio Credits API",
					version: "1.0.0",
					description: "API for managing organization credits",
				},
				tags: [
					{
						name: "Credits",
						description: "Credit status and history endpoints",
					},
					{
						name: "Internal",
						description: "Internal service-to-service endpoints",
					},
				],
			},
		}),
	)
	.use(serverTiming())
	.use(landing)
	.use(creditsRoute) // GET /v1/credits, GET /v1/credits/history
	.use(internalRoute) // POST /v1/internal/check, POST /v1/internal/deduct
	.listen(port, () => {
		logger.info(
			`Credits Service running on http://localhost:${port}/api/credits`,
		);
	});

export type CreditsService = typeof creditsService;
