/**
 * Tools Service Entry Point
 * Free tools for email verification, testing, and analysis
 */

import "dotenv/config";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { serverTiming } from "@elysiajs/server-timing";
import { logger } from "@verifio/logger";
import { Elysia } from "elysia";
import { catchallRoute } from "./routes/catchall";
import { deliverabilityRoute } from "./routes/deliverability";
import { disposableRoute } from "./routes/disposable";
import { landing } from "./routes/landing";
import { listHealthRoute } from "./routes/list-health";
import { syntaxRoute } from "./routes/syntax";
import { toolsConfig } from "./tools.config";

const port = toolsConfig.port;

const toolsService = new Elysia({
	prefix: "/api/tools",
	name: "Tools Service",
})
	.use(
		cors({
			// SECURITY: Only allow specific origins in production
			origin: toolsConfig.isProduction
				? ["https://verifio.email", "https://www.verifio.email"]
				: toolsConfig.allowedOrigins,
			methods: ["GET", "POST", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}),
	)
	.use(
		openapi({
			documentation: {
				info: {
					title: "Verifio Tools API",
					version: "1.0.0",
					description:
						"Free email verification tools for testing, validation, and analysis",
				},
				tags: [
					{
						name: "Syntax",
						description: "Email syntax validation tools",
					},
					{
						name: "Disposable",
						description: "Disposable email detection tools",
					},
					{
						name: "Deliverability",
						description: "Email deliverability testing tools",
					},
					{
						name: "List Health",
						description: "Email list health analysis tools",
					},
					{
						name: "Catch-All",
						description: "Catch-all domain detection tools",
					},
				],
			},
		}),
	)
	.use(serverTiming())
	.use(landing)
	.use(syntaxRoute) // POST /v1/syntax/validate
	.use(disposableRoute) // POST /v1/disposable/check
	.use(deliverabilityRoute) // POST /v1/deliverability/test
	.use(listHealthRoute) // POST /v1/list-health/calculate
	.use(catchallRoute) // POST /v1/catchall/detect
	.listen(
		{
			port,
			development: !toolsConfig.isProduction,
			// SECURITY: Prevent resource exhaustion from slow/hanging requests
			requestTimeout: 30000, // 30 seconds
		},
		() => {
			logger.info(
				`Tools Service running on http://localhost:${port}/api/tools`,
			);
		},
	);

export type ToolsService = typeof toolsService;
