<?php

namespace Verifio\Exceptions;

class RateLimitException extends VerifioException
{
    protected ?int $retryAfter;

    public function __construct(?string $message = null, ?int $retryAfter = null)
    {
        parent::__construct($message ?? "Rate limit exceeded", 429, "RATE_LIMIT_EXCEEDED");
        $this->retryAfter = $retryAfter;
    }

    public function getRetryAfter(): ?int
    {
        return $this->retryAfter;
    }
}
