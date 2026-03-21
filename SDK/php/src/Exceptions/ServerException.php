<?php

namespace Verifio\Exceptions;

class ServerException extends VerifioException
{
    public function __construct(?string $message = null)
    {
        parent::__construct($message ?? "Internal server error", 500, "SERVER_ERROR");
    }
}
