/**
 * Tools Routes Aggregator
 */

import { catchallRoute } from "@verifio/tools/routes/tools/routes/catchall.route";
import { deliverabilityRoute } from "@verifio/tools/routes/tools/routes/deliverability.route";
import { disposableRoute } from "@verifio/tools/routes/tools/routes/disposable.route";
import { listHealthRoute } from "@verifio/tools/routes/tools/routes/list-health.route";
import { syntaxRoute } from "@verifio/tools/routes/tools/routes/syntax.route";
import { Elysia } from "elysia";

export const toolsRoutes = new Elysia()
  .use(syntaxRoute)
  .use(disposableRoute)
  .use(deliverabilityRoute)
  .use(listHealthRoute)
  .use(catchallRoute);
