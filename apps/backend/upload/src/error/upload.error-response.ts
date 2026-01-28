import { errorCodes } from "@verifio/upload/error/upload.error-code";
import { status } from "elysia";

export const uploadErrorResponse = (errorMessage: string) => {
  if (errorMessage.includes("File not found")) {
    return status(404, {
      message: "File not found",
      errorCode: errorCodes.FILE_NOT_FOUND,
    } as const);
  }
  if (errorMessage.includes("File size exceeds")) {
    return status(400, {
      message: "File size exceeds maximum allowed size",
      errorCode: errorCodes.FILE_TOO_LARGE,
    } as const);
  }
  if (errorMessage.includes("Invalid file type")) {
    return status(400, {
      message: "Invalid file type. Only images are allowed",
      errorCode: errorCodes.INVALID_FILE_TYPE,
    } as const);
  }
  if (errorMessage.includes("No file provided")) {
    return status(400, {
      message: "No file provided",
      errorCode: errorCodes.UPLOAD_FAILED,
    } as const);
  }
  if (errorMessage.includes("Database")) {
    return status(503, {
      message: "Database error",
      errorCode: errorCodes.DATABASE_ERROR,
    } as const);
  }
  if (errorMessage.includes("Unauthorized")) {
    return status(401, {
      message: "Unauthorized",
      errorCode: errorCodes.UNAUTHORIZED,
    } as const);
  }
  return status(500, {
    message: "Internal server error",
    errorCode: errorCodes.INTERNAL_SERVER_ERROR,
  } as const);
};
