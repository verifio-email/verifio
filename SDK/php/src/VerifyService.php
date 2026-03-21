<?php

namespace Verifio;

use Verifio\Types\VerifyOptions;

class VerifyService
{
    private VerifioClient $client;

    public function __construct(VerifioClient $client)
    {
        $this->client = $client;
    }

    /**
     * @param string $email
     * @param VerifyOptions|null $options
     * @return array
     */
    public function verify(string $email, ?VerifyOptions $options = null): array
    {
        $body = ['email' => $email];
        if ($options !== null) {
            $body['options'] = $options->toArray();
        }

        return $this->client->request('POST', '/verify', $body);
    }
}
