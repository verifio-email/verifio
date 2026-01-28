import { LogsModel } from "@verifio/logs/model/logs.model";
import { addLogHandler } from "@verifio/logs/routes/logs/controllers";
import { Elysia } from "elysia";

export const addLogRoute = new Elysia().post(
	"/add",
	async ({ body }) => {
		return await addLogHandler(body);
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
