/**
 * Credits Routes Aggregator
 */

import { getCreditsRoute } from "@verifio/credits/routes/credits/routes/get-credits.route";
import { getHistoryRoute } from "@verifio/credits/routes/credits/routes/get-history.route";
import { internalRoute } from "@verifio/credits/routes/credits/routes/internal.route";
import { Elysia } from "elysia";

export const creditsRoutes = new Elysia({ prefix: "/v1", name: "CreditsRoutes" })
  .use(getCreditsRoute)
  .use(getHistoryRoute)
  .use(internalRoute);
