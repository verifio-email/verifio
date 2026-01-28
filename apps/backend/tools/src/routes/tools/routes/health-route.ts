/**
 * Health Route
 */

import { ToolsModel } from "@verifio/tools/model/tools.model";
import { Elysia } from "elysia";

export const healthRoute = new Elysia().get(
  "/",
  () => ({
    status: "ok",
    service: "Verifio Tools Service",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  }),
  {
    response: {
      200: ToolsModel.healthResponse,
    },
    detail: {
      summary: "Tools Service",
      description: "Health check endpoint for Tools Service",
    },
  },
);
