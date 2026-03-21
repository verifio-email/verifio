package verifio

import (
	"fmt"
)

// HistoryService handles verification history retrieval
type HistoryService struct {
	client *VerifioClient
}

// List retrieves verification history with pagination
func (s *HistoryService) List(options *PaginationOptions) (*PaginatedData[VerificationResult], error) {
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

	path := fmt.Sprintf("/history?page=%d&limit=%d", page, limit)

	var results PaginatedData[VerificationResult]
	err := s.client.Request("GET", path, nil, &results)
	if err != nil {
		return nil, err
	}

	return &results, nil
}
