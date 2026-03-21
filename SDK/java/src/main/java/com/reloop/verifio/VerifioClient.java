package com.reloop.verifio;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.reloop.verifio.errors.*;
import com.reloop.verifio.types.ApiResponse;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class VerifioClient {
    private final String apiKey;
    private final String baseUrl;
    private final HttpClient httpClient;
    private final ObjectMapper mapper;

    public VerifioClient(String apiKey, String baseUrl) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new ValidationException("API key is required");
        }
        this.apiKey = apiKey;
        this.baseUrl = (baseUrl != null ? baseUrl : "https://verifio.email").replaceAll("/+$", "");
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(30))
                .build();
        this.mapper = new ObjectMapper();
    }

    public <T> T request(String method, String path, Object body, Class<T> responseType) {
        try {
            String url = this.baseUrl + "/api/verify/v1" + path;
            
            HttpRequest.Builder reqBuilder = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Authorization", "Bearer " + this.apiKey)
                    .header("Content-Type", "application/json");

            if (body != null) {
                String jsonBody = mapper.writeValueAsString(body);
                reqBuilder.method(method, HttpRequest.BodyPublishers.ofString(jsonBody));
            } else {
                if (method.equals("GET")) reqBuilder.GET();
                else if (method.equals("DELETE")) reqBuilder.DELETE();
                else reqBuilder.method(method, HttpRequest.BodyPublishers.noBody());
            }

            HttpResponse<String> response = this.httpClient.send(reqBuilder.build(), HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                if (responseType == Void.class) return null;
                ApiResponse res = mapper.readValue(response.body(), ApiResponse.class);
                if (res.isSuccess()) {
                    if (res.getData() != null) {
                        return mapper.treeToValue(res.getData(), responseType);
                    }
                    return null;
                } else {
                    handleError(response.statusCode(), res.getError(), null);
                }
            } else {
                String errMsg = "HTTP Error " + response.statusCode();
                ObjectNode errData = null;
                try {
                    ApiResponse res = mapper.readValue(response.body(), ApiResponse.class);
                    errMsg = res.getError() != null ? res.getError() : errMsg;
                    if (res.getData() != null && res.getData().isObject()) {
                        errData = (ObjectNode) res.getData();
                    }
                } catch (Exception e) {
                    // Ignore parse errors for raw error responses
                }
                handleError(response.statusCode(), errMsg, errData);
            }
            return null;
        } catch (VerifioException e) {
            throw e;
        } catch (Exception e) {
            throw new VerifioException("Request failed: " + e.getMessage());
        }
    }

    private void handleError(int status, String message, ObjectNode data) {
        if (message == null) message = "An error occurred";
        
        switch (status) {
            case 401:
                throw new AuthenticationException(message);
            case 402:
                Integer remaining = data != null && data.has("remaining") ? data.get("remaining").asInt() : null;
                Integer required = data != null && data.has("required") ? data.get("required").asInt() : null;
                throw new InsufficientCreditsException(message, remaining, required);
            case 404:
                throw new NotFoundException(message);
            case 429:
                throw new RateLimitException(message, null);
            case 400:
                throw new ValidationException(message);
            case 500:
            case 502:
            case 503:
                throw new ServerException(message);
            default:
                throw new VerifioException(message, status, null);
        }
    }
}
