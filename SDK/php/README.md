# Verifio PHP SDK

Official PHP SDK for Verifio email verification.

## Installation

via Composer:
```bash
composer require verifio/email-verification
```

## Quick Start

```php
require 'vendor/autoload.php';

use Verifio\Verifio;

$verifio = new Verifio('your-api-key');

try {
    $result = $verifio->verify->verify('test@example.com');
    // PHP arrays are returned organically mapped from JSON
    echo "State: " . $result['state'] . "\n";
    echo "Score: " . $result['score'] . "\n";
} catch (\Verifio\Exceptions\VerifioException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
```

## Configuration Options

```php
use Verifio\Verifio;
use Verifio\Types\VerifyOptions;

$verifio = new Verifio('your-api-key');

$options = new VerifyOptions();
$options->skipDisposable = true;
$options->skipRole = false;

$result = $verifio->verify->verify('test@example.com', $options);
```

### Response Formats
All requests seamlessly translate the API's JSON output back into deep associative arrays in PHP for maximal flexibility and native integrations alongside modern frameworks like Laravel or Symfony. Custom exceptions are explicitly thrown allowing accurate capture and control flows!
