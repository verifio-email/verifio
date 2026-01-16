import { createOpenAPI } from "fumadocs-openapi/server";

export const openapi = createOpenAPI({
  // the OpenAPI schema, relative to project root
  input: ["https://verifio.email/api/verify/openapi/json"],
});
