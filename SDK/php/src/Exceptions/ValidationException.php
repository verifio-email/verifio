<?php

namespace Verifio\Exceptions;

class ValidationException extends VerifioException
{
    public function __construct(?string $message = null)
    {
        parent::__construct($message ?? "Validation error", 400, "VALIDATION_ERROR");
    }
}
