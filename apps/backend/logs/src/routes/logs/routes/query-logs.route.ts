import {
	type AuthenticatedUser,
	authMiddleware,
} from "@verifio/logs/middleware/auth";
import { LogsModel } from "@verifio/logs/model/logs.model";
import { queryLogsHandler } from "@verifio/logs/routes/logs/controllers";
import { Elysia } from "elysia";

export const queryLogsRoute = new Elysia().use(authMiddleware).get(
	"/query",
	async ({ query, user }) => {
		const typedUser = user as AuthenticatedUser;
		return await queryLogsHandler(typedUser.activeOrganizationId, query);
	},
	{
		auth: true,
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
