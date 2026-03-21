<?php

namespace Verifio;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Exception\GuzzleException;
use Verifio\Exceptions\AuthenticationException;
use Verifio\Exceptions\InsufficientCreditsException;
use Verifio\Exceptions\NotFoundException;
use Verifio\Exceptions\RateLimitException;
use Verifio\Exceptions\ServerException;
use Verifio\Exceptions\ValidationException;
use Verifio\Exceptions\VerifioException;

class VerifioClient
{
    private string $apiKey;
    private string $baseUrl;
    private Client $httpClient;

    public function __construct(string $apiKey, ?string $baseUrl = null, ?Client $httpClient = null)
    {
        if (empty($apiKey)) {
            throw new ValidationException("API key is required");
        }

        $this->apiKey = $apiKey;
        $this->baseUrl = rtrim($baseUrl ?? 'https://verifio.email', '/');
        $this->httpClient = $httpClient ?? new Client([
            'timeout' => 30.0,
        ]);
    }

    /**
     * @param string $method
     * @param string $path
     * @param array|null $body
     * @return array|null Returns decoded JSON array or null
     * @throws VerifioException
     */
    public function request(string $method, string $path, ?array $body = null): ?array
    {
        $url = $this->baseUrl . "/api/verify/v1" . $path;

        $options = [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type'  => 'application/json',
                'Accept'        => 'application/json',
            ],
        ];

        if ($body !== null) {
            $options['json'] = $body;
        }

        try {
            $response = $this->httpClient->request($method, $url, $options);
            $statusCode = $response->getStatusCode();
            $content = $response->getBody()->getContents();

            $decoded = json_decode($content, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new VerifioException("Invalid JSON response from server");
            }

            if ($statusCode >= 200 && $statusCode < 300) {
                if (isset($decoded['success']) && $decoded['success'] === true) {
                    return $decoded['data'] ?? null;
                }
                $this->handleError($statusCode, $decoded['error'] ?? null, $decoded['data'] ?? null);
            }

            $this->handleError($statusCode, null, null);

        } catch (RequestException $e) {
            $statusCode = 0;
            $errorMsg = $e->getMessage();
            $errorData = null;

            if ($e->hasResponse()) {
                $statusCode = $e->getResponse()->getStatusCode();
                $content = $e->getResponse()->getBody()->getContents();
                $decoded = json_decode($content, true);
                
                if (json_last_error() === JSON_ERROR_NONE) {
                    $errorMsg = $decoded['error'] ?? "HTTP Error " . $statusCode;
                    $errorData = $decoded['data'] ?? null;
                } else {
                    $errorMsg = "HTTP Error " . $statusCode;
                }
            }

            if ($statusCode > 0) {
                $this->handleError($statusCode, $errorMsg, $errorData);
            }

            throw new VerifioException("Network error: " . $errorMsg);
        } catch (GuzzleException $e) {
            throw new VerifioException("Client error: " . $e->getMessage());
        }
        
        return null;
    }

    /**
     * @throws VerifioException
     */
    private function handleError(int $status, ?string $message, ?array $data): void
    {
        $message = $message ?? "An error occurred";

        switch ($status) {
            case 401:
                throw new AuthenticationException($message);
            case 402:
                $remaining = $data['remaining'] ?? null;
                $required = $data['required'] ?? null;
                throw new InsufficientCreditsException($message, $remaining, $required);
            case 404:
                throw new NotFoundException($message);
            case 429:
                $retryAfter = $data['retry_after'] ?? null;
                throw new RateLimitException($message, $retryAfter);
            case 400:
                throw new ValidationException($message);
            case 500:
            case 502:
            case 503:
                throw new ServerException($message);
            default:
                throw new VerifioException($message, $status, null);
        }
    }
}
