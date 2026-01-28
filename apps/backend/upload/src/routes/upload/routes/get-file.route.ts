import { uploadErrorResponse } from "@verifio/upload/error/upload.error-response";
import type { AuthenticatedUser } from "@verifio/upload/middleware/auth";
import { authMiddleware } from "@verifio/upload/middleware/auth";
import { UploadModel } from "@verifio/upload/model/upload.model";
import { getFileHandler } from "@verifio/upload/routes/upload/controllers/get-file";
import { Elysia, t } from "elysia";

export const getFileRoute = new Elysia().use(authMiddleware).get(
	"/files/:fileId",
	async ({ params, user, set }) => {
		const { fileId } = params;
		const typedUser = user as AuthenticatedUser;
		const { activeOrganizationId } = typedUser;
		try {
			const { file, mimeType } = await getFileHandler({
				fileId,
				organizationId: activeOrganizationId,
			});

			// Set proper headers for file serving
			set.headers["Content-Type"] = mimeType;
			set.headers["Cache-Control"] = "public, max-age=31536000, immutable";

			return file;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			return uploadErrorResponse(errorMessage);
		}
	},
	{
		auth: true,
		params: t.Object({
			fileId: UploadModel.fileIdParam,
		}),
		response: {
			200: t.Any(),
			400: UploadModel.errorResponse,
			401: UploadModel.errorResponse,
			404: UploadModel.errorResponse,
			403: UploadModel.unauthorized,
			500: UploadModel.errorResponse,
			503: UploadModel.errorResponse,
		},
		detail: {
			summary: "File Details",
			description: "Retrieves and serves an uploaded image file",
		},
	},
);
