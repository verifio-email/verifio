import { Elysia } from "elysia";
import { bulkVerifyRoutes } from "./routes/bulk-verify.route";
import { historyRoutes } from "./routes/get-history.route";
import { verifyEmailRoute } from "./routes/verify-email.route";

export const verifyRoutes = new Elysia({ prefix: "/v1", name: "VerifyRoutes" })
	.use(verifyEmailRoute)
	.use(bulkVerifyRoutes)
	.use(historyRoutes);
