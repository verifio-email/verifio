<?php

namespace Verifio\Types;

class VerifyOptions
{
    public ?bool $skipDisposable = null;
    public ?bool $skipRole = null;
    public ?bool $skipTypo = null;

    public function toArray(): array
    {
        $opts = [];
        if ($this->skipDisposable !== null) $opts['skipDisposable'] = $this->skipDisposable;
        if ($this->skipRole !== null) $opts['skipRole'] = $this->skipRole;
        if ($this->skipTypo !== null) $opts['skipTypo'] = $this->skipTypo;
        return $opts;
    }
}
