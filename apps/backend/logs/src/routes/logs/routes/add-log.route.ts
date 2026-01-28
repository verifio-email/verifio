import {
	type AuthenticatedUser,
	authMiddleware,
} from "@verifio/logs/middleware/auth";
import { LogsModel } from "@verifio/logs/model/logs.model";
import { addLogHandler } from "@verifio/logs/routes/logs/controllers";
import { Elysia } from "elysia";

export const addLogRoute = new Elysia().use(authMiddleware).post(
	"/add",
	async ({ body, user }) => {
		const typedUser = user as AuthenticatedUser;
		return await addLogHandler(
			typedUser.id,
			typedUser.activeOrganizationId,
			body,
		);
	},
	{
		auth: true,
		body: LogsModel.logBody,
		response: {
			200: LogsModel.logResponse,
		},
		detail: {
			summary: "Add log",
			description:
				"Adds a new log entry. Used by other services to track API usage, errors, and metrics.",
		},
	},
);
