package verifio

import (
	"fmt"
)

// BulkService handles bulk email verification operations
type BulkService struct {
	client *VerifioClient
}

// Verify starts a bulk verification job
func (s *BulkService) Verify(emails []string) (*BulkVerificationJob, error) {
	body := map[string]interface{}{
		"emails": emails,
	}

	var job BulkVerificationJob
	err := s.client.Request("POST", "/bulk", body, &job)
	if err != nil {
		return nil, err
	}

	return &job, nil
}

// GetJob gets the status of a bulk verification job
func (s *BulkService) GetJob(jobID string) (*BulkVerificationJob, error) {
	path := fmt.Sprintf("/bulk-jobs/%s", jobID)

	var job BulkVerificationJob
	err := s.client.Request("GET", path, nil, &job)
	if err != nil {
		return nil, err
	}

	return &job, nil
}

// GetResults gets the completed results of a bulk job
func (s *BulkService) GetResults(jobID string, options *PaginationOptions) (*PaginatedData[VerificationResult], error) {
	page := 1
	limit := 20

	if options != nil {
		if options.Page != nil {
			page = *options.Page
		}
		if options.Limit != nil {
			limit = *options.Limit
		}
	}

	path := fmt.Sprintf("/bulk-jobs/%s/results?page=%d&limit=%d", jobID, page, limit)

	var results PaginatedData[VerificationResult]
	err := s.client.Request("GET", path, nil, &results)
	if err != nil {
		return nil, err
	}

	return &results, nil
}
