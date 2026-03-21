from typing import Optional

class VerifioError(Exception):
    def __init__(self, message: str, status_code: Optional[int] = None, code: Optional[str] = None):
        super().__init__(message)
        self.status_code = status_code
        self.code = code
        self.name = "VerifioError"

class AuthenticationError(VerifioError):
    def __init__(self, message: str = "Invalid API key"):
        super().__init__(message, 401, "AUTHENTICATION_ERROR")
        self.name = "AuthenticationError"

class InsufficientCreditsError(VerifioError):
    def __init__(self, message: str = "Insufficient credits", remaining: Optional[int] = None, required: Optional[int] = None):
        super().__init__(message, 402, "INSUFFICIENT_CREDITS")
        self.name = "InsufficientCreditsError"
        self.remaining = remaining
        self.required = required

class NotFoundError(VerifioError):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, 404, "NOT_FOUND")
        self.name = "NotFoundError"

class RateLimitError(VerifioError):
    def __init__(self, message: str = "Rate limit exceeded", retry_after: Optional[int] = None):
        super().__init__(message, 429, "RATE_LIMIT_EXCEEDED")
        self.name = "RateLimitError"
        self.retry_after = retry_after

class ValidationError(VerifioError):
    def __init__(self, message: str):
        super().__init__(message, 400, "VALIDATION_ERROR")
        self.name = "ValidationError"

class ServerError(VerifioError):
    def __init__(self, message: str = "Internal server error"):
        super().__init__(message, 500, "SERVER_ERROR")
        self.name = "ServerError"
