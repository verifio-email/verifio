/**
 * Landing route for health checks
 */

import { Elysia } from "elysia";

export const landingRoute = new Elysia().get("/", () => {
  return {
    service: "Verifio Logging Service",
    status: "healthy",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  };
});
