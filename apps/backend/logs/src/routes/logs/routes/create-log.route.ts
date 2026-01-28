import { LogsModel } from "@verifio/logs/model/logs.model";
import { createLogHandler } from "@verifio/logs/routes/logs/controllers";
import { Elysia } from "elysia";

export const createLogRoute = new Elysia().post(
	"/add",
	async ({ body }) => {
		return await createLogHandler(body);
	},
	{
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
