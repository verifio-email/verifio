package com.reloop.verifio.errors;

public class VerifioException extends RuntimeException {
    private final Integer statusCode;
    private final String code;

    public VerifioException(String message) {
        this(message, null, null);
    }

    public VerifioException(String message, Integer statusCode, String code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }

    public Integer getStatusCode() {
        return statusCode;
    }

    public String getCode() {
        return code;
    }

    @Override
    public String toString() {
        if (code != null) {
            return String.format("VerifioException [%d %s]: %s", statusCode, code, getMessage());
        }
        if (statusCode != null) {
            return String.format("VerifioException [%d]: %s", statusCode, getMessage());
        }
        return "VerifioException: " + getMessage();
    }
}
