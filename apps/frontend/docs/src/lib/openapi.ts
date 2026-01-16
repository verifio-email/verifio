import { createOpenAPI } from "fumadocs-openapi/server";

export const openapi = createOpenAPI({
  // the OpenAPI schema, relative to project root
  input: ["./content/openapi/verify.json"],
});
