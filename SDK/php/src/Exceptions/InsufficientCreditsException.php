<?php

namespace Verifio\Exceptions;

class InsufficientCreditsException extends VerifioException
{
    protected ?int $remaining;
    protected ?int $required;

    public function __construct(?string $message = null, ?int $remaining = null, ?int $required = null)
    {
        parent::__construct($message ?? "Insufficient credits", 402, "INSUFFICIENT_CREDITS");
        $this->remaining = $remaining;
        $this->required = $required;
    }

    public function getRemaining(): ?int
    {
        return $this->remaining;
    }

    public function getRequired(): ?int
    {
        return $this->required;
    }
}
