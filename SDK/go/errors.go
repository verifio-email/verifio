package verifio

import "fmt"

// VerifioError represents a general API error
type VerifioError struct {
	Message    string
	StatusCode int
	Code       string
}

func (e *VerifioError) Error() string {
	if e.Code != "" {
		return fmt.Sprintf("VerifioError [%d %s]: %s", e.StatusCode, e.Code, e.Message)
	}
	if e.StatusCode != 0 {
		return fmt.Sprintf("VerifioError [%d]: %s", e.StatusCode, e.Message)
	}
	return fmt.Sprintf("VerifioError: %s", e.Message)
}

// AuthenticationError occurs when the API key is missing or invalid
type AuthenticationError struct {
	*VerifioError
}

func NewAuthenticationError(message string) *AuthenticationError {
	if message == "" {
		message = "Invalid API key"
	}
	return &AuthenticationError{
		VerifioError: &VerifioError{
			Message:    message,
			StatusCode: 401,
			Code:       "AUTHENTICATION_ERROR",
		},
	}
}

// InsufficientCreditsError occurs when account credits are depleted
type InsufficientCreditsError struct {
	*VerifioError
	Remaining *int
	Required  *int
}

func NewInsufficientCreditsError(message string, remaining, required *int) *InsufficientCreditsError {
	if message == "" {
		message = "Insufficient credits"
	}
	return &InsufficientCreditsError{
		VerifioError: &VerifioError{
			Message:    message,
			StatusCode: 402,
			Code:       "INSUFFICIENT_CREDITS",
		},
		Remaining: remaining,
		Required:  required,
	}
}

// NotFoundError occurs when requesting a non-existent resource
type NotFoundError struct {
	*VerifioError
}

func NewNotFoundError(message string) *NotFoundError {
	if message == "" {
		message = "Resource not found"
	}
	return &NotFoundError{
		VerifioError: &VerifioError{
			Message:    message,
			StatusCode: 404,
			Code:       "NOT_FOUND",
		},
	}
}

// RateLimitError occurs when making too many requests
type RateLimitError struct {
	*VerifioError
	RetryAfter *int
}

func NewRateLimitError(message string, retryAfter *int) *RateLimitError {
	if message == "" {
		message = "Rate limit exceeded"
	}
	return &RateLimitError{
		VerifioError: &VerifioError{
			Message:    message,
			StatusCode: 429,
			Code:       "RATE_LIMIT_EXCEEDED",
		},
		RetryAfter: retryAfter,
	}
}

// ValidationError occurs when request parameters are invalid
type ValidationError struct {
	*VerifioError
}

func NewValidationError(message string) *ValidationError {
	if message == "" {
		message = "Validation error"
	}
	return &ValidationError{
		VerifioError: &VerifioError{
			Message:    message,
			StatusCode: 400,
			Code:       "VALIDATION_ERROR",
		},
	}
}

// ServerError occurs when the API experiences an internal failure
type ServerError struct {
	*VerifioError
}

func NewServerError(message string) *ServerError {
	if message == "" {
		message = "Internal server error"
	}
	return &ServerError{
		VerifioError: &VerifioError{
			Message:    message,
			StatusCode: 500,
			Code:       "SERVER_ERROR",
		},
	}
}
