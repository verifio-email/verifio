import { bulkVerifyRoutes } from "@verifio/verify/routes/verify/routes/bulk-verify.route";
import { historyRoutes } from "@verifio/verify/routes/verify/routes/get-history.route";
import { verifyEmailRoute } from "@verifio/verify/routes/verify/routes/verify-email.route";
import { Elysia } from "elysia";

export const verifyRoutes = new Elysia({ prefix: "/v1", name: "VerifyRoutes" })
	.use(verifyEmailRoute)
	.use(bulkVerifyRoutes)
	.use(historyRoutes);
