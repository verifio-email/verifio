# verifio-email

Official Verifio Node.js SDK for integrating with Verifio services.

## Installation

```bash
npm install verifio-email
```

## Quick Start

```typescript
import Verifio from 'verifio-email';

const verifio = new Verifio({
  url: 'https://verifio.email',
  key: 'your-api-key'
});

// Send an email
const result = await verifio.mail.send({
  from: 'sender@example.com',
  to: 'recipient@example.com',
  subject: 'Hello',
  text: 'Hello World!'
});
```

## Configuration

The Verifio SDK requires two configuration parameters:

- `url` - Your Verifio API base URL (e.g., `https://verifio.email`)
- `key` - Your API key

```typescript
const verifio = new Verifio({
  url: 'https://verifio.email',
  key: 'your-api-key'
});
```

## Services

### Mail Service

Send emails through the Verifio mail service.

#### Send Email

```typescript
const result = await verifio.mail.send({
  from: 'sender@example.com',
  to: 'recipient@example.com',
  subject: 'Hello',
  text: 'Plain text content',
  html: '<h1>HTML content</h1>',
  replyTo: 'noreply@example.com',
  cc: 'cc@example.com',
  bcc: ['bcc1@example.com', 'bcc2@example.com']
});

console.log(result.messageId);
```

### Domain Service

Manage domains and DNS records.

#### Create Domain

```typescript
const domain = await verifio.domain.create({
  domain: 'send.example.com'
});
```

#### Get Domain

```typescript
const domain = await verifio.domain.get('send.example.com');
```

#### List Domains

```typescript
const domains = await verifio.domain.list({
  page: 1,
  limit: 10,
  status: 'active'
});
```

#### Delete Domain

```typescript
await verifio.domain.delete('send.example.com');
```

#### DNS Operations

```typescript
// Get DNS records
const records = await verifio.domain.getDNSRecords('send.example.com');

// Get DKIM keys
const dkimKeys = await verifio.domain.getDKIMKeys('send.example.com');

// Verify DNS record
const verification = await verifio.domain.verifyDNSRecord('send.example.com', {
  recordType: 'TXT',
  name: '_verifio',
  value: 'verification-value'
});

// Generate DNS records
const generatedRecords = await verifio.domain.generateDNSRecords('send.example.com');

// Delete DNS records
await verifio.domain.deleteDNSRecords('send.example.com');
```

### Webhook Service

Manage webhooks for event notifications.

#### Create Webhook

```typescript
const webhook = await verifio.webhook.create({
  name: 'My Webhook',
  url: 'https://example.com/webhook',
  secret: 'webhook-secret',
  rateLimitEnabled: true,
  maxRequestsPerMinute: 60
});
```

#### Get Webhook

```typescript
const webhook = await verifio.webhook.get('webhook-id');
```

#### List Webhooks

```typescript
const webhooks = await verifio.webhook.list({
  page: 1,
  limit: 10,
  status: 'active'
});
```

#### Update Webhook

```typescript
const updated = await verifio.webhook.update('webhook-id', {
  name: 'Updated Webhook Name',
  status: 'paused'
});
```

#### Delete Webhook

```typescript
await verifio.webhook.delete('webhook-id');
```

### Audience Service

Manage audiences and audience groups.

#### Create Audience

```typescript
const audience = await verifio.audience.create({
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  audienceGroupId: 'group-id',
  status: 'subscribed'
});
```

#### Get Audience

```typescript
const audience = await verifio.audience.get('audience-id');
```

#### List Audiences

```typescript
const audiences = await verifio.audience.list({
  page: 1,
  limit: 10,
  status: 'subscribed',
  audienceGroupId: 'group-id'
});
```

#### Update Audience

```typescript
const updated = await verifio.audience.update('audience-id', {
  firstName: 'Jane',
  lastName: 'Smith'
});
```

#### Delete Audience

```typescript
await verifio.audience.delete('audience-id');
```

#### Bulk Import Audiences

```typescript
const result = await verifio.audience.bulkImport({
  audienceGroupId: 'group-id',
  audiences: [
    {
      email: 'user1@example.com',
      firstName: 'User',
      lastName: 'One'
    },
    {
      email: 'user2@example.com',
      firstName: 'User',
      lastName: 'Two'
    }
  ]
});

console.log(`Imported ${result.successful} audiences`);
console.log(`Failed: ${result.failed}`);
```

#### Subscribe/Unsubscribe Audience

```typescript
// Subscribe
await verifio.audience.subscribe('audience-id', {
  reason: 'User opted in'
});

// Unsubscribe
await verifio.audience.unsubscribe('audience-id', {
  reason: 'User opted out'
});
```

#### Search Audiences

```typescript
const results = await verifio.audience.search({
  query: 'john@example.com',
  page: 1,
  limit: 10
});
```

#### Audience Groups

```typescript
// Create audience group
const group = await verifio.audience.createGroup({
  name: 'My Audience Group',
  description: 'Group description'
});

// Get audience group
const group = await verifio.audience.getGroup('group-id');

// List audience groups
const groups = await verifio.audience.listGroups({
  page: 1,
  limit: 10
});

// Update audience group
const updated = await verifio.audience.updateGroup('group-id', {
  name: 'Updated Group Name'
});

// Delete audience group
await verifio.audience.deleteGroup('group-id');
```

## Error Handling

The SDK provides custom error classes for better error handling:

```typescript
import {
  VerifioError,
  APIError,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  ServerError,
  ValidationError
} from 'verifio-email';

try {
  await verifio.mail.send({...});
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Authentication failed');
  } else if (error instanceof NotFoundError) {
    console.error('Resource not found');
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded');
  } else if (error instanceof APIError) {
    console.error(`API error: ${error.message} (${error.statusCode})`);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions. All request and response types are exported:

```typescript
import type {
  SendEmailRequest,
  SendEmailResponse,
  DomainResponse,
  WebhookResponse,
  AudienceResponse
} from 'verifio-email';
```

## Requirements

- Node.js >= 18.0.0

## License

Apache-2.0

## Support

- Documentation: https://verifio.email/docs
- Issues: https://github.com/reloop-labs/verifio/issues

