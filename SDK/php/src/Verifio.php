<?php

namespace Verifio;

use GuzzleHttp\Client;

class Verifio
{
    private VerifioClient $client;

    public VerifyService $verify;
    public BulkService $bulk;
    public HistoryService $history;

    public function __construct(string $apiKey, ?string $baseUrl = null, ?Client $httpClient = null)
    {
        $this->client = new VerifioClient($apiKey, $baseUrl, $httpClient);

        $this->verify = new VerifyService($this->client);
        $this->bulk = new BulkService($this->client);
        $this->history = new HistoryService($this->client);
    }
}
