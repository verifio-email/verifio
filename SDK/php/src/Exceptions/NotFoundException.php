<?php

namespace Verifio\Exceptions;

class NotFoundException extends VerifioException
{
    public function __construct(?string $message = null)
    {
        parent::__construct($message ?? "Resource not found", 404, "NOT_FOUND");
    }
}
