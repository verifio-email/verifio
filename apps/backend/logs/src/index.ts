import "dotenv/config";
import { fromTypes, openapi } from "@elysiajs/openapi";
import { serverTiming } from "@elysiajs/server-timing";
import { logger } from "@verifio/logger";
import { loader } from "@verifio/tracehub/utils/loader";
import { Elysia } from "elysia";
import { logsConfig } from "./logs.config";
import { landingRoute } from "./routes/landing/landing.route";
import { tracehubRoutes } from "./routes/tracehub/tracehub.routes";

const port = logsConfig.port;
const tracehubService = new Elysia({
	prefix: "/api/tracehub",
	name: "tracehub service",
})
	.use(
		openapi({
			references: fromTypes(
				logsConfig.NODE_ENV === "production"
					? "dist/index.d.ts"
					: "src/index.ts",
			),
		}),
	)
	.use(serverTiming())
	.use(landingRoute)
	.use(tracehubRoutes)
	.onStart(async () => {
		await loader();
	})
	.listen(port, () => {
		logger.info(
			`tracehub server is running on http://localhost:${port}/api/tracehub`,
		);
	});

export type TraceHubService = typeof tracehubService;
