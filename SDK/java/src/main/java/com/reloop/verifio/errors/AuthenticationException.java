package com.reloop.verifio.errors;

public class AuthenticationException extends VerifioException {
    public AuthenticationException(String message) {
        super(message != null ? message : "Invalid API key", 401, "AUTHENTICATION_ERROR");
    }
}
