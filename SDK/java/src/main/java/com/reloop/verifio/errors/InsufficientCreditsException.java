package com.reloop.verifio.errors;

public class InsufficientCreditsException extends VerifioException {
    private final Integer remaining;
    private final Integer required;

    public InsufficientCreditsException(String message, Integer remaining, Integer required) {
        super(message != null ? message : "Insufficient credits", 402, "INSUFFICIENT_CREDITS");
        this.remaining = remaining;
        this.required = required;
    }

    public Integer getRemaining() {
        return remaining;
    }

    public Integer getRequired() {
        return required;
    }
}
