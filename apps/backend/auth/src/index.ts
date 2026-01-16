import "dotenv/config";
import cors from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@verifio/logger";
import { Elysia } from "elysia";
import { authConfig } from "./auth.config";
import { landing } from "./landing";
import { auth, OpenAPI } from "./lib/auth";
import { loader } from "./loader";
import { authRateLimiter } from "./middleware/rate-limit";

const port = authConfig.port;

const app = new Elysia({ prefix: "/api/auth", name: "Auth Service" })
	.use(
		cors({
			origin: authConfig.isProduction
				? ["https://verifio.email", "https://www.verifio.email"]
				: true,
		}),
	)
	.use(authRateLimiter)
	.use(
		swagger({
			path: "/docs",
			documentation: {
				components: await OpenAPI.components(),
				paths: await OpenAPI.getPaths(),
			},
		}),
	)
	.mount("/", auth.handler)
	.use(landing)
	.onStart(async () => {
		await loader();
	})
	.listen(port, () => {
		logger.info(`Auth Server is running on http://localhost:${port}/api/auth`);
	});

export type App = typeof app;
