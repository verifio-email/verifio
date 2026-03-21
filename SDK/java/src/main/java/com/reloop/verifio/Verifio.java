package com.reloop.verifio;

public class Verifio {
    private final VerifioClient client;
    public final VerifyService verify;
    public final BulkService bulk;
    public final HistoryService history;

    public Verifio(String apiKey) {
        this(apiKey, null);
    }

    public Verifio(String apiKey, String baseUrl) {
        this.client = new VerifioClient(apiKey, baseUrl);
        this.verify = new VerifyService(this.client);
        this.bulk = new BulkService(this.client);
        this.history = new HistoryService(this.client);
    }
}
