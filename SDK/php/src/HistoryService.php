<?php

namespace Verifio;

use Verifio\Types\PaginationOptions;

class HistoryService
{
    private VerifioClient $client;

    public function __construct(VerifioClient $client)
    {
        $this->client = $client;
    }

    /**
     * @param PaginationOptions|null $options
     * @return array
     */
    public function list(?PaginationOptions $options = null): array
    {
        $opts = $options ?? new PaginationOptions();
        $query = http_build_query($opts->toQueryArray());

        return $this->client->request('GET', '/history?' . $query);
    }
}
