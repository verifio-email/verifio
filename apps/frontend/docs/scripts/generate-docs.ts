import { openapi } from "@fe/docs/lib/openapi";
import { generateFiles } from "fumadocs-openapi";
import { createOpenAPI } from "fumadocs-openapi/server";

// Generate API reference docs (public docs)
void generateFiles({
  input: openapi,
  output: './content/docs/api-reference',
  includeDescription: true,
});

// Create OpenAPI instances for each service
const creditsOpenapi = createOpenAPI({
  input: ['https://verifio.email/api/credits/openapi/json'],
});

const logsOpenapi = createOpenAPI({
  input: ['https://verifio.email/api/logs/openapi/json'],
});

const apiKeyOpenapi = createOpenAPI({
  input: ['https://verifio.email/api/api-key/openapi/json'],
});

const uploadOpenapi = createOpenAPI({
  input: ['https://verifio.email/api/upload/openapi/json'],
});

const verifyOpenapi = createOpenAPI({
  input: ['https://verifio.email/api/verify/openapi/json'],
});

// Generate setup docs - all services output to backend folder directly (flat structure)
void generateFiles({
  input: creditsOpenapi,
  output: './content/docs/setup/backend',
  per: 'operation',
  includeDescription: true,
  addGeneratedComment: true,
});

void generateFiles({
  input: logsOpenapi,
  output: './content/docs/setup/backend',
  per: 'operation',
  includeDescription: true,
  addGeneratedComment: true,
});

void generateFiles({
  input: apiKeyOpenapi,
  output: './content/docs/setup/backend',
  per: 'operation',
  includeDescription: true,
  addGeneratedComment: true,
});

void generateFiles({
  input: uploadOpenapi,
  output: './content/docs/setup/backend',
  per: 'operation',
  includeDescription: true,
  addGeneratedComment: true,
});

void generateFiles({
  input: verifyOpenapi,
  output: './content/docs/setup/backend',
  per: 'operation',
  includeDescription: true,
  addGeneratedComment: true,
});
