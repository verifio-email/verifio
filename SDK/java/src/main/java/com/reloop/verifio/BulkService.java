package com.reloop.verifio;

import com.fasterxml.jackson.core.type.TypeReference;
import com.reloop.verifio.types.BulkVerificationJob;
import com.reloop.verifio.types.PaginatedData;
import com.reloop.verifio.types.PaginationOptions;
import com.reloop.verifio.types.VerificationResult;

import java.util.Collections;
import java.util.Map;

public class BulkService {
    private final VerifioClient client;

    public BulkService(VerifioClient client) {
        this.client = client;
    }

    public BulkVerificationJob verify(java.util.List<String> emails) {
        Map<String, Object> body = Collections.singletonMap("emails", emails);
        return this.client.request("POST", "/bulk", body, BulkVerificationJob.class);
    }

    public BulkVerificationJob getJob(String jobId) {
        return this.client.request("GET", "/bulk-jobs/" + jobId, null, BulkVerificationJob.class);
    }

    // Since Jackson needs TypeReference to deserialize generics, we use a Raw approach or TypeReference via ObjectMapper.
    // For simplicity with the generic Client, we can get raw Object and map it, or use a workaround.
    @SuppressWarnings("unchecked")
    public PaginatedData<VerificationResult> getResults(String jobId, PaginationOptions options) {
        int page = options != null && options.getPage() != null ? options.getPage() : 1;
        int limit = options != null && options.getLimit() != null ? options.getLimit() : 20;

        String path = "/bulk-jobs/" + jobId + "/results?page=" + page + "&limit=" + limit;

        // Note: Due to Java type erasure, we can't easily pass generic class tokens. 
        // Deserializing to standard class works if we have a concrete type.
        return this.client.request("GET", path, null, VerificationResultPaginated.class);
    }

    // Concrete type for JSON mapping
    public static class VerificationResultPaginated extends PaginatedData<VerificationResult> {}
}
