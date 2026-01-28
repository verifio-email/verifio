import { errorCodes } from "@verifio/credits/error/credits.error-code";
import { status } from "elysia";

export const creditsErrorResponse = (errorMessage: string) => {
	if (errorMessage.includes("Organization not found")) {
		return status(404, {
			message: "Organization not found",
			errorCode: errorCodes.ORGANIZATION_NOT_FOUND,
		});
	}
	if (errorMessage.includes("Insufficient credits")) {
		return status(402, {
			message: "Insufficient credits",
			errorCode: errorCodes.INSUFFICIENT_CREDITS,
		});
	}
	if (errorMessage.includes("Credit record not found")) {
		return status(404, {
			message: "Credit record not found",
			errorCode: errorCodes.CREDIT_RECORD_NOT_FOUND,
		});
	}
	if (errorMessage.includes("Invalid amount")) {
		return status(400, {
			message: "Invalid amount",
			errorCode: errorCodes.INVALID_AMOUNT,
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
