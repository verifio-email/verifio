import { status } from "elysia";
import { errorCodes } from "./verify.error-code";

export const verifyErrorResponse = (errorMessage: string) => {
	if (errorMessage.includes("Insufficient credits")) {
		return status(402, {
			message: "Insufficient credits",
			errorCode: errorCodes.INSUFFICIENT_CREDITS,
		});
	}
	if (errorMessage.includes("Invalid email")) {
		return status(400, {
			message: "Invalid email format",
			errorCode: errorCodes.INVALID_EMAIL,
		});
	}
	if (errorMessage.includes("Verification timeout")) {
		return status(503, {
			message: "Verification timeout - service unavailable",
			errorCode: errorCodes.VERIFICATION_TIMEOUT,
		});
	}
	if (errorMessage.includes("Job not found")) {
		return status(404, {
			message: "Job not found",
			errorCode: errorCodes.JOB_NOT_FOUND,
		});
	}
	if (errorMessage.includes("Verification result not found")) {
		return status(404, {
			message: "Verification result not found",
			errorCode: errorCodes.RESULT_NOT_FOUND,
		});
	}
	return status(500, {
		message: "Internal server error",
		errorCode: errorCodes.INTERNAL_SERVER_ERROR,
	});
};
