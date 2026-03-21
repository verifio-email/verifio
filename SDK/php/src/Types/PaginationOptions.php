<?php

namespace Verifio\Types;

class PaginationOptions
{
    public ?int $page = null;
    public ?int $limit = null;

    public function toQueryArray(): array
    {
        return [
            'page' => $this->page ?? 1,
            'limit' => $this->limit ?? 20,
        ];
    }
}
