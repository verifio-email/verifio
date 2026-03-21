<?php

namespace Verifio\Exceptions;

class AuthenticationException extends VerifioException
{
    public function __construct(?string $message = null)
    {
        parent::__construct($message ?? "Invalid API key", 401, "AUTHENTICATION_ERROR");
    }
}
