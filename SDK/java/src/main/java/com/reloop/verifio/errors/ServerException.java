package com.reloop.verifio.errors;

public class ServerException extends VerifioException {
    public ServerException(String message) {
        super(message != null ? message : "Internal server error", 500, "SERVER_ERROR");
    }
}
