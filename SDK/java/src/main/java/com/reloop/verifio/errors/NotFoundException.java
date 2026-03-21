package com.reloop.verifio.errors;

public class NotFoundException extends VerifioException {
    public NotFoundException(String message) {
        super(message != null ? message : "Resource not found", 404, "NOT_FOUND");
    }
}
