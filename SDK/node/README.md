# @verifio/email-verification

Official Node.js SDK for Verifio email verification.

## Installation

```bash
npm install @verifio/email-verification
# or
yarn add @verifio/email-verification
# or
bun add @verifio/email-verification
```

## Quick Start

```typescript
import { Verifio } from '@verifio/email-verification';

const verifio = new Verifio({
  apiKey: 'your-api-key'
});

// Verify an email
const result = await verifio.verify('test@example.com');

console.log(result.state);  // 'deliverable' | 'undeliverable' | 'risky' | 'unknown'
console.log(result.score);  // 0-100
```

## Configuration

```typescript
const verifio = new Verifio({
  apiKey: 'your-api-key',      // Required
  baseUrl: 'https://verifio.email'  // Optional, defaults to https://verifio.email
});
```

## API Reference

### Single Email Verification

```typescript
const result = await verifio.verify('test@example.com');

// With options
const result = await verifio.verify('test@example.com', {
  skipDisposable: false,  // Include disposable check
  skipRole: false,        // Include role-based check
  skipTypo: false         // Include typo suggestion
});

// Result structure
{
  email: 'test@example.com',
  state: 'deliverable',      // Primary verdict
  score: 95,                 // Quality score (0-100)
  reason: 'valid_mailbox',
  checks: {
    syntax: { valid: true },
    dns: { valid: true, hasMx: true, mxRecords: ['...'] },
    disposable: { isDisposable: false },
    role: { isRole: false },
    freeProvider: { isFree: false },
    typo: { hasTypo: false },
    smtp: { valid: true, mailboxExists: true }
  },
  analytics: {
    riskLevel: 'low',
    qualityIndicators: ['has_mx', 'valid_syntax'],
    warnings: []
  }
}
```

### Bulk Verification

```typescript
// Start bulk job
const job = await verifio.bulk.verify([
  'email1@example.com',
  'email2@example.com',
  'email3@example.com'
]);

console.log(job.id);     // Job ID
console.log(job.status); // 'pending' | 'processing' | 'completed' | 'failed'

// Check job status
const status = await verifio.bulk.getJob(job.id);
console.log(status.processedEmails, '/', status.totalEmails);

// Get results when completed
const results = await verifio.bulk.getResults(job.id, {
  page: 1,
  limit: 50
});

results.items.forEach(r => {
  console.log(r.email, r.state, r.score);
});
```

### Verification History

```typescript
const history = await verifio.history.list({
  page: 1,
  limit: 20
});

console.log(`Total: ${history.pagination.total}`);

history.items.forEach(result => {
  console.log(result.email, result.state);
});
```

## Error Handling

```typescript
import {
  Verifio,
  AuthenticationError,
  InsufficientCreditsError,
  RateLimitError,
  VerifioError
} from '@verifio/email-verification';

try {
  const result = await verifio.verify('test@example.com');
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof InsufficientCreditsError) {
    console.error(`Not enough credits. Remaining: ${error.remaining}`);
  } else if (error instanceof RateLimitError) {
    console.error('Rate limited. Try again later.');
  } else if (error instanceof VerifioError) {
    console.error('API error:', error.message);
  }
}
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  VerificationResult,
  VerificationState,
  BulkVerificationJob,
  VerifyOptions
} from '@verifio/email-verification';
```

## Requirements

- Node.js >= 18.0.0

## License

MIT

## Support

- Documentation: https://verifio.email/docs
- Issues: https://github.com/reloop-labs/verifio/issues
