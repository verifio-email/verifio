import { createLogRoute } from "@verifio/logs/routes/logs/routes/create-log.route";
import { listLogsRoute } from "@verifio/logs/routes/logs/routes/list-logs.route";
import { Elysia } from "elysia";

export const logsRoutes = new Elysia({ prefix: "/v1", name: "LogsRoutes" })
  .use(createLogRoute)
  .use(listLogsRoute);
