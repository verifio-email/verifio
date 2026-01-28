import { LogsModel } from "@verifio/logs/model/logs.model";
import { createLogHandler } from "@verifio/logs/routes/logs/controllers";
import { Elysia } from "elysia";

export const createLogRoute = new Elysia().post(
  "/log",
  async ({ body }) => {
    return await createLogHandler(body);
  },
  {
    body: LogsModel.logBody,
    response: {
      200: LogsModel.logResponse,
    },
    detail: {
      tags: ["Logs"],
      summary: "Create activity log",
      description: "Insert a single activity log entry",
    },
  },
);
