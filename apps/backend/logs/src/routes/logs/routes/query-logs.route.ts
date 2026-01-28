import { LogsModel } from "@verifio/logs/model/logs.model";
import { queryLogsHandler } from "@verifio/logs/routes/logs/controllers";
import { Elysia } from "elysia";

export const queryLogsRoute = new Elysia().get(
	"/query",
	async ({ query }) => {
		return await queryLogsHandler(query);
	},
	{
		query: LogsModel.logsQuery,
		response: {
			200: LogsModel.logsResponse,
		},
		detail: {
			summary: "Query logs",
			description:
				"Queries logs with filtering and pagination. Supports filtering by service, endpoint, status, date range, and text search.",
		},
	},
);
