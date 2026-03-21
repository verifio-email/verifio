# Verifio Python SDK

Official Python SDK for Verifio email verification.

## Installation

```bash
pip install verifio-python
```

*Note: Requires Python 3.7+*

## Quick Start

```python
from verifio import Verifio

verifio = Verifio({
  "apiKey": "your-api-key"
})

# Verify an email
result = verifio.verify("test@example.com")

print(result["state"])  # 'deliverable' | 'undeliverable' | 'risky' | 'unknown'
print(result["score"])  # 0-100
```

## Configuration

```python
verifio = Verifio({
  "apiKey": "your-api-key",           # Required
  "baseUrl": "https://verifio.email"  # Optional, defaults to https://verifio.email
})
```

## API Reference

### Single Email Verification

```python
result = verifio.verify("test@example.com")

# With options
result = verifio.verify("test@example.com", {
  "skipDisposable": False,  # Include disposable check
  "skipRole": False,        # Include role-based check
  "skipTypo": False         # Include typo suggestion
})

# Result structure
# {
#   "email": "test@example.com",
#   "state": "deliverable",      # Primary verdict
#   "score": 95,                 # Quality score (0-100)
#   "reason": "valid_mailbox",
#   "checks": { ... },
#   "analytics": { ... }
# }
```

### Bulk Verification

```python
# Start bulk job
job = verifio.bulk.verify([
  "email1@example.com",
  "email2@example.com",
  "email3@example.com"
])

print(job["id"])     # Job ID
print(job["status"]) # 'pending' | 'processing' | 'completed' | 'failed'

# Check job status
status = verifio.bulk.get_job(job["id"])
print(f"{status['processedEmails']} / {status['totalEmails']}")

# Get results when completed
results = verifio.bulk.get_results(job["id"], {
  "page": 1,
  "limit": 50
})

for r in results["items"]:
  print(r["email"], r["state"], r["score"])
```

### Verification History

```python
history = verifio.history.list({
  "page": 1,
  "limit": 20
})

print(f"Total: {history['pagination']['total']}")

for result in history["items"]:
  print(result["email"], result["state"])
```

## Error Handling

```python
from verifio import (
    Verifio,
    AuthenticationError,
    InsufficientCreditsError,
    RateLimitError,
    VerifioError
)

try:
    result = verifio.verify("test@example.com")
except AuthenticationError:
    print("Invalid API key")
except InsufficientCreditsError as e:
    print(f"Not enough credits. Remaining: {e.remaining}")
except RateLimitError:
    print("Rate limited. Try again later.")
except VerifioError as e:
    print(f"API error: {e}")
```

## License

MIT
