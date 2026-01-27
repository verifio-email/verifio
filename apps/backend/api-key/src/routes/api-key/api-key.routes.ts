import { authMiddleware } from "@verifio/api-key/middleware/auth";
import { createApiKeyRoute } from "@verifio/api-key/routes/api-key/routes/create-api-key.route";
import { deleteApiKeyRoute } from "@verifio/api-key/routes/api-key/routes/delete-api-key.route";
import { getApiKeyRoute } from "@verifio/api-key/routes/api-key/routes/get-api-key.route";
import { listApiKeysRoute } from "@verifio/api-key/routes/api-key/routes/list-api-keys.route";
import { rotateApiKeyRoute } from "@verifio/api-key/routes/api-key/routes/rotate-api-key.route";
import { updateApiKeyRoute } from "@verifio/api-key/routes/api-key/routes/update-api-key.route";
import { verifyApiKeyRoute } from "@verifio/api-key/routes/api-key/routes/verify-api-key.route";
import { Elysia } from "elysia";

export const apiKeyRoutes = new Elysia({ prefix: "/v1", name: "ApiKeyRoutes" })
	.use(verifyApiKeyRoute)
	.use(authMiddleware)
	.use(createApiKeyRoute)
	.use(getApiKeyRoute)
	.use(listApiKeysRoute)
	.use(updateApiKeyRoute)
	.use(deleteApiKeyRoute)
	.use(rotateApiKeyRoute);
