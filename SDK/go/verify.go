package verifio

import (
	"fmt"
)

// VerifyService handles single email verification
type VerifyService struct {
	client *VerifioClient
}

// Verify a single email address
func (s *VerifyService) Verify(email string, options *VerifyOptions) (*VerificationResult, error) {
	body := map[string]interface{}{
		"email": email,
	}

	if options != nil {
		body["options"] = options
	}

	var result VerificationResult
	err := s.client.Request("POST", "/verify", body, &result)
	if err != nil {
		return nil, err
	}

	return &result, nil
}
