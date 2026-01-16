import { openapi } from "@fe/docs/lib/openapi";
import { generateFiles } from "fumadocs-openapi";
import { createOpenAPI } from "fumadocs-openapi/server";

// Generate API reference docs (public docs)
void generateFiles({
  input: openapi,
  output: "./content/docs/api-reference",
  includeDescription: true,
});

// Create OpenAPI instances for each service
const creditsOpenapi = createOpenAPI({
  input: ["https://verifio.email/api/credits/openapi/json"],
});

const logsOpenapi = createOpenAPI({
  input: ["https://verifio.email/api/logs/openapi/json"],
});

const apiKeyOpenapi = createOpenAPI({
  input: ["https://verifio.email/api/api-key/openapi/json"],
});

const uploadOpenapi = createOpenAPI({
  input: ["https://verifio.email/api/upload/openapi/json"],
});

const verifyOpenapi = createOpenAPI({
  input: ["https://verifio.email/api/verify/openapi/json"],
});

// Generate setup docs for Credits service
void generateFiles({
  input: creditsOpenapi,
  output: "./content/docs/setup/backend/credits",
  per: "operation",
  includeDescription: true,
  addGeneratedComment: true,
});

// Generate setup docs for Logs service
void generateFiles({
  input: logsOpenapi,
  output: "./content/docs/setup/backend/logs",
  per: "operation",
  includeDescription: true,
  addGeneratedComment: true,
});

// Generate setup docs for API Key service
void generateFiles({
  input: apiKeyOpenapi,
  output: "./content/docs/setup/backend/api-key",
  per: "operation",
  includeDescription: true,
  addGeneratedComment: true,
});

// Generate setup docs for Upload service
void generateFiles({
  input: uploadOpenapi,
  output: "./content/docs/setup/backend/upload",
  per: "operation",
  includeDescription: true,
  addGeneratedComment: true,
});

// Generate setup docs for Verify service
void generateFiles({
  input: verifyOpenapi,
  output: "./content/docs/setup/backend/verify",
  per: "operation",
  includeDescription: true,
  addGeneratedComment: true,
});
