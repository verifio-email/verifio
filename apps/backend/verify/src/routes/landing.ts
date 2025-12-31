/**
 * Verify Service - Landing Route
 */

import { Elysia } from "elysia";

export const landing = new Elysia().get("/", () => ({
  service: "Verifio Email Verification Service",
  version: "1.0.0",
  status: "healthy",
  endpoints: {
    single: "POST /v1/email",
    bulk: "POST /v1/bulk",
    status: "GET /v1/jobs/:jobId",
    results: "GET /v1/jobs/:jobId/results",
  },
}));
