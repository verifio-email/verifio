/**
 * Verify Service Entry Point
 */

import "dotenv/config";
import { cors } from "@elysiajs/cors";
import { fromTypes, openapi } from "@elysiajs/openapi";
import { serverTiming } from "@elysiajs/server-timing";
import { logger } from "@verifio/logger";
import { Elysia } from "elysia";
import { verifyConfig } from "./config";
import { bulkVerifyRoute } from "./routes/bulk";
import { landing } from "./routes/landing";
import { singleVerifyRoute } from "./routes/single";

const port = verifyConfig.port;

const verifyService = new Elysia({
  prefix: "/api/verify",
  name: "Email Verification Service",
})
  .use(
    cors({
      origin: true,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "X-API-Key", "Authorization"],
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
        ],
      },
    }),
  )
  .use(serverTiming())
  .use(landing)
  .use(singleVerifyRoute)
  .use(bulkVerifyRoute)
  .listen(port, () => {
    logger.info(
      `Email Verification Service running on http://localhost:${port}/api/verify`,
    );
  });

export type VerifyService = typeof verifyService;
