import { errorCodes } from "@verifio/logs/error/logs.error-code";
import { status } from "elysia";

export const logsErrorResponse = (errorMessage: string) => {
	if (errorMessage.includes("Log not found")) {
		return status(404, {
			message: "Log not found",
			errorCode: errorCodes.LOG_NOT_FOUND,
		});
	}
	if (errorMessage.includes("Failed to insert")) {
		return status(500, {
			message: "Failed to add log entry",
			errorCode: errorCodes.LOG_ADD_FAILED,
		});
	}
	if (errorMessage.includes("Invalid query")) {
		return status(400, {
			message: "Invalid query parameters",
			errorCode: errorCodes.INVALID_QUERY_PARAMS,
		});
	}
	if (errorMessage.includes("Database")) {
		return status(503, {
			message: "Database error",
			errorCode: errorCodes.DATABASE_ERROR,
		});
	}
	if (errorMessage.includes("Unauthorized")) {
		return status(401, {
			message: "Unauthorized",
			errorCode: errorCodes.UNAUTHORIZED,
		});
	}
	return status(500, {
		message: "Internal server error",
		errorCode: errorCodes.INTERNAL_SERVER_ERROR,
	});
};
