package com.reloop.verifio;

import com.reloop.verifio.types.PaginatedData;
import com.reloop.verifio.types.PaginationOptions;
import com.reloop.verifio.types.VerificationResult;

public class HistoryService {
    private final VerifioClient client;

    public HistoryService(VerifioClient client) {
        this.client = client;
    }

    public PaginatedData<VerificationResult> list(PaginationOptions options) {
        int page = options != null && options.getPage() != null ? options.getPage() : 1;
        int limit = options != null && options.getLimit() != null ? options.getLimit() : 20;

        String path = "/history?page=" + page + "&limit=" + limit;

        return this.client.request("GET", path, null, VerificationResultPaginated.class);
    }

    public static class VerificationResultPaginated extends PaginatedData<VerificationResult> {}
}
