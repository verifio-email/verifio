import { errorCodes } from "@verifio/tools/error/tools.error-code";
import { status } from "elysia";

export const toolsErrorResponse = (errorMessage: string) => {
	if (errorMessage.includes("Rate limit")) {
		return status(429, {
			message: "Rate limit exceeded. Please try again later.",
			errorCode: errorCodes.RATE_LIMIT_EXCEEDED,
		} as const);
	}
	if (errorMessage.includes("Invalid email")) {
		return status(400, {
			message: "Invalid email format",
			errorCode: errorCodes.INVALID_EMAIL_FORMAT,
		} as const);
	}
	if (errorMessage.includes("DNS")) {
		return status(503, {
			message: "DNS lookup failed",
			errorCode: errorCodes.DNS_LOOKUP_FAILED,
		} as const);
	}
	if (errorMessage.includes("SMTP")) {
		return status(503, {
			message: "SMTP connection failed",
			errorCode: errorCodes.SMTP_CONNECTION_FAILED,
		} as const);
	}
	if (errorMessage.includes("timeout") || errorMessage.includes("Timeout")) {
		return status(504, {
			message: "Request timed out",
			errorCode: errorCodes.TIMEOUT,
		} as const);
	}
	return status(500, {
		message: "Internal server error",
		errorCode: errorCodes.INTERNAL_SERVER_ERROR,
	} as const);
};
