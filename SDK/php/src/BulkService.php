<?php

namespace Verifio;

use Verifio\Types\PaginationOptions;

class BulkService
{
    private VerifioClient $client;

    public function __construct(VerifioClient $client)
    {
        $this->client = $client;
    }

    /**
     * @param array<string> $emails
     * @return array
     */
    public function verify(array $emails): array
    {
        return $this->client->request('POST', '/bulk', ['emails' => $emails]);
    }

    /**
     * @param string $jobId
     * @return array
     */
    public function getJob(string $jobId): array
    {
        return $this->client->request('GET', '/bulk-jobs/' . $jobId);
    }

    /**
     * @param string $jobId
     * @param PaginationOptions|null $options
     * @return array
     */
    public function getResults(string $jobId, ?PaginationOptions $options = null): array
    {
        $opts = $options ?? new PaginationOptions();
        $query = http_build_query($opts->toQueryArray());

        return $this->client->request('GET', '/bulk-jobs/' . $jobId . '/results?' . $query);
    }
}
