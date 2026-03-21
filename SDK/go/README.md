# Verifio Go SDK

Official Go SDK for Verifio email verification.

## Installation

```bash
go get github.com/reloop-labs/verifio-go
```

## Quick Start

```go
package main

import (
	"fmt"
	"log"

	"github.com/reloop-labs/verifio-go"
)

func main() {
	client, err := verifio.New(verifio.VerifioConfig{
		APIKey: "your-api-key",
	})
	if err != nil {
		log.Fatalf("Failed to initialize Verifio client: %v", err)
	}

	// Verify an email
	result, err := client.Verify.Verify("test@example.com", nil)
	if err != nil {
		log.Fatalf("Verification error: %v", err)
	}

	fmt.Println("Result State:", result.State) // 'deliverable' | 'undeliverable' | 'risky' | 'unknown'
	fmt.Println("Score:", result.Score)        // 0-100
}
```

## Configuration

```go
client, err := verifio.New(verifio.VerifioConfig{
    APIKey:  "your-api-key",           // Required
    BaseURL: "https://verifio.email",  // Optional
})
```

## API Reference

### Single Email Verification

```go
result, err := client.Verify.Verify("test@example.com", nil)

// With options
skipDisposable := false
skipRole := false
skipTypo := false

result, err = client.Verify.Verify("test@example.com", &verifio.VerifyOptions{
	SkipDisposable: &skipDisposable,
	SkipRole:       &skipRole,
	SkipTypo:       &skipTypo,
})
```

### Bulk Verification

```go
// Start bulk job
emails := []string{"email1@example.com", "email2@example.com"}
job, err := client.Bulk.Verify(emails)

fmt.Println(job.ID)     // Job ID
fmt.Println(job.Status) // 'pending' | 'processing' | 'completed' | 'failed'

// Check job status
status, err := client.Bulk.GetJob(job.ID)
fmt.Printf("%d / %d processed\n", status.ProcessedEmails, status.TotalEmails)

// Get results when completed
page := 1
limit := 50
results, err := client.Bulk.GetResults(job.ID, &verifio.PaginationOptions{
	Page:  &page,
	Limit: &limit,
})

for _, r := range results.Items {
	fmt.Println(r.Email, r.State, r.Score)
}
```

### Verification History

```go
page := 1
limit := 20
history, err := client.History.List(&verifio.PaginationOptions{
	Page:  &page,
	Limit: &limit,
})

fmt.Printf("Total: %d\n", history.Pagination.Total)

for _, r := range history.Items {
	fmt.Println(r.Email, r.State)
}
```

## Error Handling

The SDK returns custom errors that map directly to the API responses.

```go
result, err := client.Verify.Verify("test@example.com", nil)

if err != nil {
	switch e := err.(type) {
	case *verifio.AuthenticationError:
		fmt.Println("Invalid API key")
	case *verifio.InsufficientCreditsError:
		if e.Remaining != nil {
			fmt.Printf("Not enough credits. Remaining: %d\n", *e.Remaining)
		}
	case *verifio.RateLimitError:
		fmt.Println("Rate limited. Try again later.")
	case *verifio.VerifioError:
		fmt.Printf("API error: %s (status %d)\n", e.Message, e.StatusCode)
	default:
		fmt.Printf("Unexpected error: %v\n", err)
	}
}
```

## License

MIT
