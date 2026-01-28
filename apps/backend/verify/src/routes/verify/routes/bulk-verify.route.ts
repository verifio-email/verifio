import { Elysia, t } from "elysia";
import type { AuthenticatedUser } from "../../../middleware/auth";
import { authMiddleware } from "../../../middleware/auth";
import { VerifyModel } from "../../../model/verify.model";
import {
	createBulkVerifyJobHandler,
	getBulkJobResultsHandler,
	getBulkJobStatusHandler,
} from "../controllers";

export const bulkVerifyRoutes = new Elysia()
	.use(authMiddleware)
	// Create bulk verification job
	.post(
		"/bulk-verify",
		async ({ body, user, request, set }) => {
			const typedUser = user as AuthenticatedUser;
			const result = await createBulkVerifyJobHandler(
				typedUser.activeOrganizationId,
				typedUser.id,
				body,
				request.headers.get("x-forwarded-for") || undefined,
				request.headers.get("user-agent") || undefined,
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
		async ({ params, user }) => {
			const typedUser = user as AuthenticatedUser;
			return await getBulkJobStatusHandler(
				params.jobId,
				typedUser.activeOrganizationId,
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
		async ({ params, query, user }) => {
			const typedUser = user as AuthenticatedUser;
			const page = Math.max(1, Number(query.page) || 1);
			const limit = Math.min(100, Math.max(1, Number(query.limit) || 50));
			return await getBulkJobResultsHandler(
				params.jobId,
				typedUser.activeOrganizationId,
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
