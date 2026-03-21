import type { AuthenticatedUser } from "@verifio/verify/middleware/auth";
import { authMiddleware } from "@verifio/verify/middleware/auth";
import { VerifyModel } from "@verifio/verify/model/verify.model";
import {
	getVerificationHistoryHandler,
	getVerificationJobsHandler,
	getVerificationResultHandler,
} from "@verifio/verify/routes/verify/controllers";
import { Elysia, t } from "elysia";

export const historyRoutes = new Elysia()
	.use(authMiddleware)
	// Get verification history
	.get(
		"/history",
		async ({ query, organizationId, set }) => {
			if (!organizationId) {
				set.status = 401;
				return { success: false, error: "Organization mapping not found" };
			}
			const page = Math.max(1, Number.parseInt(query.page || "1", 10));
			const limit = Math.min(
				100,
				Math.max(1, Number.parseInt(query.limit || "20", 10)),
			);
			return await getVerificationHistoryHandler(
				organizationId,
				page,
				limit,
			);
		},
		{
			auth: true,
			query: VerifyModel.historyQuery,
			detail: {
				summary: "Get verification history",
				description: "Get paginated verification history for the organization",
			},
		},
	)
	// Get verification jobs
	.get(
		"/jobs",
		async ({ query, organizationId, set }) => {
			if (!organizationId) {
				set.status = 401;
				return { success: false, error: "Organization mapping not found" };
			}
			const page = Math.max(1, Number.parseInt(query.page || "1", 10));
			const limit = Math.min(
				50,
				Math.max(1, Number.parseInt(query.limit || "10", 10)),
			);
			return await getVerificationJobsHandler(
				organizationId,
				page,
				limit,
			);
		},
		{
			auth: true,
			query: VerifyModel.jobQuery,
			detail: {
				summary: "Get verification jobs",
				description:
					"Get paginated bulk verification jobs for the organization",
			},
		},
	)
	// Get single verification result
	.get(
		"/results/:resultId",
		async ({ params, organizationId, set }) => {
			if (!organizationId) {
				set.status = 401;
				return { success: false, error: "Organization mapping not found" };
			}
			return await getVerificationResultHandler(
				params.resultId,
				organizationId,
			);
		},
		{
			auth: true,
			params: t.Object({ resultId: t.String() }),
			detail: {
				summary: "Get verification result",
				description: "Get a single verification result by ID",
			},
		},
	);
