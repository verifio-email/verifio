package com.reloop.verifio.types;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ApiResponse {
    private boolean success;
    private JsonNode data;
    private String error;

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public JsonNode getData() { return data; }
    public void setData(JsonNode data) { this.data = data; }
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
}
