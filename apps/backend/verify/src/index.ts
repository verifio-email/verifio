/**
 * Verify Service Entry Point
 */

import "dotenv/config";
import { cors } from "@elysiajs/cors";
import { fromTypes, openapi } from "@elysiajs/openapi";
import { serverTiming } from "@elysiajs/server-timing";
import { logger } from "@verifio/logger";
import { Elysia } from "elysia";
import { authenticatedSingleRoute } from "./routes/authenticated";
import { authenticatedBulkRoute } from "./routes/authenticated-bulk";
import { bulkVerifyRoute } from "./routes/bulk";
import { historyRoute } from "./routes/history";
import { landing } from "./routes/landing";
import { singleVerifyRoute } from "./routes/single";
import { verifyConfig } from "./verify.config";

const port = verifyConfig.port;

const verifyService = new Elysia({
	prefix: "/api/verify",
	name: "Email Verification Service",
})
	.use(
		cors({
			// SECURITY: Only allow specific origins in production
			origin: verifyConfig.isProduction
				? ["https://verifio.email", "https://www.verifio.email"]
				: [
						"http://localhost:3000",
						"http://localhost:3001",
						"https://local.verifio.email",
					],
			methods: ["GET", "POST", "OPTIONS"],
			allowedHeaders: ["Content-Type", "X-API-Key", "Authorization", "Cookie"],
			credentials: true,
		}),
	)
	.use(
		openapi({
			documentation: {
				info: {
					title: "Verifio Email Verification API",
					version: "1.0.0",
					description:
						"Comprehensive email verification API for validating email addresses",
				},
				tags: [
					{
						name: "Verification",
						description: "Single email verification endpoints",
					},
					{
						name: "Bulk Verification",
						description: "Bulk email verification endpoints",
					},
					{
						name: "History",
						description: "Verification history endpoints",
					},
				],
			},
		}),
	)
	.use(serverTiming())
	.use(landing)
	.use(singleVerifyRoute) // Public: POST /v1/email
	.use(bulkVerifyRoute) // Public: POST /v1/bulk
	.use(authenticatedSingleRoute) // Authenticated: POST /v1/verify (stores in DB)
	.use(authenticatedBulkRoute) // Authenticated: POST /v1/bulk-verify (stores in DB)
	.use(historyRoute) // Authenticated: GET /v1/history, GET /v1/jobs
	.listen(
		{
			port,
			development: !verifyConfig.isProduction,
			// SECURITY: Prevent resource exhaustion from slow/hanging requests
			requestTimeout: 30000, // 30 seconds
		},
		() => {
			logger.info(
				`Email Verification Service running on http://localhost:${port}/api/verify`,
			);
		},
	);

export type VerifyService = typeof verifyService;
