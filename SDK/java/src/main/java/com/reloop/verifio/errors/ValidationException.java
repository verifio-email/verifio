package com.reloop.verifio.errors;

public class ValidationException extends VerifioException {
    public ValidationException(String message) {
        super(message != null ? message : "Validation error", 400, "VALIDATION_ERROR");
    }
}
