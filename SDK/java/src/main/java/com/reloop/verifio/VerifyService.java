package com.reloop.verifio;

import com.reloop.verifio.types.VerificationResult;
import com.reloop.verifio.types.VerifyOptions;

import java.util.HashMap;
import java.util.Map;

public class VerifyService {
    private final VerifioClient client;

    public VerifyService(VerifioClient client) {
        this.client = client;
    }

    public VerificationResult verify(String email, VerifyOptions options) {
        Map<String, Object> body = new HashMap<>();
        body.put("email", email);
        if (options != null) {
            body.put("options", options);
        }

        return this.client.request("POST", "/verify", body, VerificationResult.class);
    }
}
