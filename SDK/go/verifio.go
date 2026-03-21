package verifio

// Verifio is the official Go SDK client for Verifio email verification
//
// Example:
//
//	client, err := verifio.New(verifio.VerifioConfig{APIKey: "your-api-key"})
//	if err != nil { ... }
//
//	result, err := client.Verify("test@example.com", nil)
//	fmt.Println(result.State) // 'deliverable' | 'undeliverable' | 'risky' | 'unknown'
type Verifio struct {
	client  *VerifioClient
	Verify  *VerifyService
	Bulk    *BulkService
	History *HistoryService
}

// New creates a new Verifio SDK instance
func New(config VerifioConfig) (*Verifio, error) {
	client, err := NewClient(config)
	if err != nil {
		return nil, err
	}

	return &Verifio{
		client:  client,
		Verify:  &VerifyService{client: client},
		Bulk:    &BulkService{client: client},
		History: &HistoryService{client: client},
	}, nil
}
