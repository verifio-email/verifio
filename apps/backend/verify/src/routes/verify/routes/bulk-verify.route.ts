import type { AuthenticatedUser } from "@verifio/verify/middleware/auth";
import { authMiddleware } from "@verifio/verify/middleware/auth";
import { VerifyModel } from "@verifio/verify/model/verify.model";
import {
	createBulkVerifyJobHandler,
	getBulkJobResultsHandler,
	getBulkJobStatusHandler,
} from "@verifio/verify/routes/verify/controllers";
import { Elysia, t } from "elysia";

export const bulkVerifyRoutes = new Elysia()
	.use(authMiddleware)
	// Create bulk verification job
	.post(
		"/bulk-verify",
		async ({ body, organizationId, userId, apiKeyId, request, set }) => {
			if (!organizationId) {
				set.status = 401;
				return { success: false, error: "Organization mapping not found" };
			}
			const result = await createBulkVerifyJobHandler(
				organizationId,
				userId,
				apiKeyId,
				body,
				request.headers.get("x-forwarded-for") || undefined,
				request.headers.get("user-agent") || undefined,
				request.headers.get("cookie") || undefined,
			);

			if (!result.success && result.error?.includes("Insufficient credits")) {
				set.status = 402;
			}

			return result;
		},
		{
			auth: true,
			body: VerifyModel.bulkVerifyBody,
			detail: {
				summary: "Start bulk verification",
				description:
					"Start a bulk email verification job with results stored in database",
			},
		},
	)
	// Get job status
	.get(
		"/bulk-jobs/:jobId",
		async ({ params, organizationId, set }) => {
			if (!organizationId) {
				set.status = 401;
				return { success: false, error: "Organization mapping not found" };
			}
			return await getBulkJobStatusHandler(
				params.jobId,
				organizationId,
			);
		},
		{
			auth: true,
			params: t.Object({ jobId: t.String() }),
			detail: {
				summary: "Get bulk job status",
				description: "Get the status and progress of a bulk verification job",
			},
		},
	)
	// Get job results
	.get(
		"/bulk-jobs/:jobId/results",
		async ({ params, query, organizationId, set }) => {
			if (!organizationId) {
				set.status = 401;
				return { success: false, error: "Organization mapping not found" };
			}
			const page = Math.max(1, Number(query.page) || 1);
			const limit = Math.min(100, Math.max(1, Number(query.limit) || 50));
			return await getBulkJobResultsHandler(
				params.jobId,
				organizationId,
				page,
				limit,
			);
		},
		{
			auth: true,
			params: t.Object({ jobId: t.String() }),
			query: t.Object({
				page: t.Optional(t.String()),
				limit: t.Optional(t.String()),
			}),
			detail: {
				summary: "Get bulk job results",
				description: "Get results of a completed bulk verification job",
			},
		},
	);
