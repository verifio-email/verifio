import "dotenv/config";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { serverTiming } from "@elysiajs/server-timing";
import { apiKeyRoutes } from "@verifio/api-key/routes/api-key/api-key.routes";
import { apiKeyHealthRoute } from "@verifio/api-key/routes/api-key/routes/api-key-health-route";
import { loader } from "@verifio/api-key/utils/loader";
import { logger } from "@verifio/logger";
import { Elysia } from "elysia";
import { apiKeyConfig } from "./api-key.config";

const port = apiKeyConfig.port;
const apiKeyService = new Elysia({
	prefix: "/api/api-key",
	name: "API Key Service",
})
	.use(
		cors({
			origin:
				apiKeyConfig.NODE_ENV === "production"
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
	.use(openapi())
	.use(serverTiming())
	.use(apiKeyHealthRoute)
	.use(apiKeyRoutes)
	.onStart(async () => {
		await loader();
	})
	.listen(port, () => {
		logger.info(
			`API Key Server is running on http://localhost:${port}/api/api-key`,
		);
	});

export type ApiKeyService = typeof apiKeyService;
