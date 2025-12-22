import { authMiddleware } from "@verifio/api-key/middleware/auth";
import { createApiKeyRoute } from "@verifio/api-key/routes/api-key/routes/create-api-key.route";
import { deleteApiKeyRoute } from "@verifio/api-key/routes/api-key/routes/delete-api-key.route";
import { disableApiKeyRoute } from "@verifio/api-key/routes/api-key/routes/disable-api-key.route";
import { enableApiKeyRoute } from "@verifio/api-key/routes/api-key/routes/enable-api-key.route";
import { getApiKeyRoute } from "@verifio/api-key/routes/api-key/routes/get-api-key.route";
import { getUsageRoute } from "@verifio/api-key/routes/api-key/routes/get-usage.route";
import { listApiKeysRoute } from "@verifio/api-key/routes/api-key/routes/list-api-keys.route";
import { rotateApiKeyRoute } from "@verifio/api-key/routes/api-key/routes/rotate-api-key.route";
import { updateApiKeyRoute } from "@verifio/api-key/routes/api-key/routes/update-api-key.route";
import { Elysia } from "elysia";

export const apiKeyRoutes = new Elysia({
	prefix: "/v1",
	name: "ApiKeyRoutes",
})
	.use(authMiddleware)
	.use(createApiKeyRoute)
	.use(getApiKeyRoute)
	.use(listApiKeysRoute)
	.use(updateApiKeyRoute)
	.use(deleteApiKeyRoute)
	.use(rotateApiKeyRoute)
	.use(enableApiKeyRoute)
	.use(disableApiKeyRoute)
	.use(getUsageRoute);

