import { createOpenAPI } from "fumadocs-openapi/server";

export const openapi = createOpenAPI({
  // the OpenAPI schemas for all services
  input: [
    "https://verifio.email/api/verify/openapi/json",
    "https://verifio.email/api/credits/openapi/json",
    "https://verifio.email/api/logs/openapi/json",
    "https://verifio.email/api/api-key/openapi/json",
    "https://verifio.email/api/upload/openapi/json",
  ],
});

