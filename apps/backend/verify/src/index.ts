import "dotenv/config";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { serverTiming } from "@elysiajs/server-timing";
import { logger } from "@verifio/logger";
import { healthRoute } from "@verifio/verify/routes/verify/routes/health-route";
import { verifyRoutes } from "@verifio/verify/routes/verify/verify.routes";
import { loader } from "@verifio/verify/utils/loader";
import { verifyConfig } from "@verifio/verify/verify.config";
import { Elysia } from "elysia";

const port = verifyConfig.port;

const verifyService = new Elysia({
	prefix: "/api/verify",
	name: "Email Verification Service",
})
	.use(
		cors({
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
	.use(openapi())
	.use(serverTiming())
	.use(healthRoute)
	.use(verifyRoutes)
	.onStart(async () => {
		await loader();
	})
	.listen(
		{
			port,
			development: !verifyConfig.isProduction,
			requestTimeout: 30000,
		},
		() => {
			logger.info(
				`Email Verification Service running on http://localhost:${port}/api/verify`,
			);
		},
	);

export type VerifyService = typeof verifyService;
