package com.reloop.verifio.errors;

public class RateLimitException extends VerifioException {
    private final Integer retryAfter;

    public RateLimitException(String message, Integer retryAfter) {
        super(message != null ? message : "Rate limit exceeded", 429, "RATE_LIMIT_EXCEEDED");
        this.retryAfter = retryAfter;
    }

    public Integer getRetryAfter() {
        return retryAfter;
    }
}
