<?php

namespace Verifio\Exceptions;

use Exception;

class VerifioException extends Exception
{
    protected ?int $statusCode;
    protected ?string $errorCode;

    public function __construct(string $message, ?int $statusCode = null, ?string $errorCode = null)
    {
        parent::__construct($message);
        $this->statusCode = $statusCode;
        $this->errorCode = $errorCode;
    }

    public function getStatusCode(): ?int
    {
        return $this->statusCode;
    }

    public function getErrorCode(): ?string
    {
        return $this->errorCode;
    }

    public function __toString(): string
    {
        if ($this->errorCode !== null) {
            return "VerifioException [{$this->statusCode} {$this->errorCode}]: {$this->message}";
        }
        if ($this->statusCode !== null) {
            return "VerifioException [{$this->statusCode}]: {$this->message}";
        }
        return "VerifioException: {$this->message}";
    }
}
