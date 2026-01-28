import "dotenv/config";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { serverTiming } from "@elysiajs/server-timing";
import { logger } from "@verifio/logger";
import { healthRoute } from "@verifio/upload/routes/upload/routes/health-route";
import { uploadRoutes } from "@verifio/upload/routes/upload/upload.routes";
import { uploadConfig } from "@verifio/upload/upload.config";
import { loader } from "@verifio/upload/utils/loader";
import { Elysia } from "elysia";

const port = uploadConfig.port;

const uploadService = new Elysia({
	prefix: "/api/upload",
	name: "Upload Service",
})
	.use(
		cors({
			origin:
				uploadConfig.NODE_ENV === "production"
					? ["https://verifio.email", "https://www.verifio.email"]
					: [
							"http://localhost:3000",
							"http://localhost:3001",
							"https://local.verifio.email",
						],
			methods: ["GET", "POST", "DELETE", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
			credentials: true,
		}),
	)
	.use(openapi())
	.use(serverTiming())
	.use(healthRoute)
	.use(uploadRoutes)
	.onStart(async () => {
		await loader();
	})
	.listen(port, () => {
		logger.info(
			`Upload Server is running on http://localhost:${port}/api/upload`,
		);
	});

export type UploadService = typeof uploadService;
