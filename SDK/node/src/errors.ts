/**
 * Verifio SDK Error Classes
 */

export class VerifioError extends Error {
	constructor(
		message: string,
		public statusCode?: number,
		public code?: string,
	) {
		super(message);
		this.name = "VerifioError";
	}
}

export class AuthenticationError extends VerifioError {
	constructor(message = "Invalid API key") {
		super(message, 401, "AUTHENTICATION_ERROR");
		this.name = "AuthenticationError";
	}
}

export class InsufficientCreditsError extends VerifioError {
	constructor(
		message = "Insufficient credits",
		public remaining?: number,
		public required?: number,
	) {
		super(message, 402, "INSUFFICIENT_CREDITS");
		this.name = "InsufficientCreditsError";
	}
}

export class NotFoundError extends VerifioError {
	constructor(message = "Resource not found") {
		super(message, 404, "NOT_FOUND");
		this.name = "NotFoundError";
	}
}

export class RateLimitError extends VerifioError {
	constructor(
		message = "Rate limit exceeded",
		public retryAfter?: number,
	) {
		super(message, 429, "RATE_LIMIT_EXCEEDED");
		this.name = "RateLimitError";
	}
}

export class ValidationError extends VerifioError {
	constructor(message: string) {
		super(message, 400, "VALIDATION_ERROR");
		this.name = "ValidationError";
	}
}

export class ServerError extends VerifioError {
	constructor(message = "Internal server error") {
		super(message, 500, "SERVER_ERROR");
		this.name = "ServerError";
	}
}
