import { LogsModel } from "@verifio/logs/model/logs.model";
import { listLogsHandler } from "@verifio/logs/routes/logs/controllers";
import { Elysia } from "elysia";

export const listLogsRoute = new Elysia().get(
  "/logs",
  async ({ query }) => {
    return await listLogsHandler(query);
  },
  {
    query: LogsModel.logsQuery,
    response: {
      200: LogsModel.logsResponse,
    },
    detail: {
      tags: ["Logs"],
      summary: "Query activity logs",
      description: "Get activity logs with filtering and pagination",
    },
  },
);
