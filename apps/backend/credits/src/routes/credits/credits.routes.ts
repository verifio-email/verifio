/**
 * Credits Routes Aggregator
 */

import { checkCreditsRoute } from "@verifio/credits/routes/credits/routes/check-credits.route";
import { deductCreditsRoute } from "@verifio/credits/routes/credits/routes/deduct-credits.route";
import { getStatusRoute } from "@verifio/credits/routes/credits/routes/get-credits.route";
import { getHistoryRoute } from "@verifio/credits/routes/credits/routes/get-history.route";
import { Elysia } from "elysia";

export const creditsRoutes = new Elysia({
	prefix: "/v1",
	name: "CreditsRoutes",
})
	.use(getStatusRoute)
	.use(getHistoryRoute)
	.use(checkCreditsRoute)
	.use(deductCreditsRoute);
