/**
 * Logging Service Entry Point
 */

import "dotenv/config";
import { cors } from "@elysiajs/cors";
import { fromTypes, openapi } from "@elysiajs/openapi";
import { serverTiming } from "@elysiajs/server-timing";
import { logger } from "@verifio/logger";
import { Elysia } from "elysia";
import { loggingConfig } from "./config";
import { landingRoute } from "./routes/landing.route";
import { logRoute } from "./routes/log.route";
import { logsRoute } from "./routes/logs.route";
import { loader } from "./utils/loader";

const port = loggingConfig.port;

const loggingService = new Elysia({
  prefix: "/api/logging",
  name: "Logging Service",
})
  .use(
    openapi({
      documentation: {
        info: {
          title: "Verifio Logging API",
          version: "1.0.0",
          description: "Centralized activity logging for Verifio services",
        },
        tags: [
          {
            name: "Logging",
            description: "Activity log endpoints",
          },
        ],
      },
      references: fromTypes(
        loggingConfig.NODE_ENV === "production"
          ? "dist/index.d.ts"
          : "src/index.ts"
      ),
    })
  )
  .use(serverTiming())
  .use(landingRoute)
  .group("/v1", (app) => app.use(logRoute).use(logsRoute))
  .onStart(async () => {
    await loader();
  })
  .listen(port, () => {
    logger.info(
      `Logging Service running on http://localhost:${port}/api/logging`
    );
  });

export type LoggingService = typeof loggingService;
