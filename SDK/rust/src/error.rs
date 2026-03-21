use thiserror::Error;

#[derive(Error, Debug)]
pub enum VerifioError {
    #[error("Authentication Error: {0}")]
    AuthenticationError(String),

    #[error("Insufficient Credits: {0}")]
    InsufficientCreditsError {
        message: String,
        remaining: Option<i32>,
        required: Option<i32>,
    },

    #[error("Not Found: {0}")]
    NotFoundError(String),

    #[error("Rate Limit Exceeded: {0}")]
    RateLimitError {
        message: String,
        retry_after: Option<i32>,
    },

    #[error("Validation Error: {0}")]
    ValidationError(String),

    #[error("Server Error: {0}")]
    ServerError(String),

    #[error("API Error [{status}]: {message}")]
    ApiError {
        status: u16,
        message: String,
    },

    #[error("Network Error: {0}")]
    NetworkError(#[from] reqwest::Error),

    #[error("Parse Error: {0}")]
    ParseError(#[from] serde_json::Error),
}
