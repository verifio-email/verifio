package verifio

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

const DefaultBaseURL = "https://verifio.email"

// VerifioClient handles HTTP requests to the Verifio API
type VerifioClient struct {
	APIKey     string
	BaseURL    string
	HttpClient *http.Client
}

// NewClient creates a new VerifioClient
func NewClient(config VerifioConfig) (*VerifioClient, error) {
	if config.APIKey == "" {
		return nil, NewValidationError("API key is required")
	}

	baseURL := config.BaseURL
	if baseURL == "" {
		baseURL = DefaultBaseURL
	}
	baseURL = strings.TrimRight(baseURL, "/")

	return &VerifioClient{
		APIKey:  config.APIKey,
		BaseURL: baseURL,
		HttpClient: &http.Client{
			Timeout: time.Second * 30,
		},
	}, nil
}

// Request performs an HTTP request to the Verifio API
func (c *VerifioClient) Request(method, path string, body interface{}, responseData interface{}) error {
	url := fmt.Sprintf("%s/api/verify/v1%s", c.BaseURL, path)

	var reqBody io.Reader
	if body != nil {
		jsonBody, err := json.Marshal(body)
		if err != nil {
			return &VerifioError{Message: fmt.Sprintf("failed to marshal request body: %s", err)}
		}
		reqBody = bytes.NewBuffer(jsonBody)
	}

	req, err := http.NewRequest(method, url, reqBody)
	if err != nil {
		return &VerifioError{Message: fmt.Sprintf("failed to create request: %s", err)}
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.APIKey))

	res, err := c.HttpClient.Do(req)
	if err != nil {
		return &VerifioError{Message: fmt.Sprintf("network error: %s", err)}
	}
	defer res.Body.Close()

	bodyBytes, err := io.ReadAll(res.Body)
	if err != nil {
		return &VerifioError{Message: fmt.Sprintf("failed to read response: %s", err)}
	}

	var apiRes GenericAPIResponse
	if err := json.Unmarshal(bodyBytes, &apiRes); err != nil {
		if res.StatusCode >= 400 {
			return c.handleError(res.StatusCode, GenericAPIResponse{Error: fmt.Sprintf("HTTP Error %d", res.StatusCode)})
		}
		return &VerifioError{Message: "Invalid JSON response from server"}
	}

	if !res.StatusCode >= 200 && res.StatusCode < 300 || !apiRes.Success {
		return c.handleError(res.StatusCode, apiRes)
	}

	if responseData != nil && len(apiRes.Data) > 0 {
		if err := json.Unmarshal(apiRes.Data, responseData); err != nil {
			return &VerifioError{Message: fmt.Sprintf("failed to unmarshal response data: %s", err)}
		}
	}

	return nil
}

// handleError maps HTTP responses to custom errors
func (c *VerifioClient) handleError(status int, apiRes GenericAPIResponse) error {
	message := apiRes.Error
	if message == "" {
		message = "An error occurred"
	}

	var errorData map[string]interface{}
	if len(apiRes.Data) > 0 {
		_ = json.Unmarshal(apiRes.Data, &errorData)
	}

	switch status {
	case 401:
		return NewAuthenticationError(message)
	case 402:
		var remaining, required *int
		if remFloat, ok := errorData["remaining"].(float64); ok {
			rem := int(remFloat)
			remaining = &rem
		}
		if reqFloat, ok := errorData["required"].(float64); ok {
			req := int(reqFloat)
			required = &req
		}
		return NewInsufficientCreditsError(message, remaining, required)
	case 404:
		return NewNotFoundError(message)
	case 429:
		return NewRateLimitError(message, nil)
	case 400:
		return NewValidationError(message)
	case 500, 502, 503:
		return NewServerError(message)
	default:
		return &VerifioError{Message: message, StatusCode: status}
	}
}
