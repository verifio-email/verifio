import { addLogRoute } from "@verifio/logs/routes/logs/routes/add-log.route";
import { queryLogsRoute } from "@verifio/logs/routes/logs/routes/query-logs.route";
import { Elysia } from "elysia";

export const logsRoutes = new Elysia({ prefix: "/v1", name: "LogsRoutes" })
	.use(addLogRoute)
	.use(queryLogsRoute);
