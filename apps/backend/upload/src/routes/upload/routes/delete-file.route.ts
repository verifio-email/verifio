import type { AuthenticatedUser } from "@verifio/upload/middleware/auth";
import { uploadErrorResponse } from "@verifio/upload/error/upload.error-response";
import { authMiddleware } from "@verifio/upload/middleware/auth";
import { UploadModel } from "@verifio/upload/model/upload.model";
import { deleteFileHandler } from "@verifio/upload/routes/upload/controllers/delete-file";
import { Elysia, t } from "elysia";

export const deleteFileRoute = new Elysia().use(authMiddleware).delete(
	"/files/:fileId",
	async ({ params, user }) => {
		const { fileId } = params;
		const typedUser = user as AuthenticatedUser;
		const { id: userId, activeOrganizationId } = typedUser;
		try {
			return await deleteFileHandler({
				fileId,
				userId,
				organizationId: activeOrganizationId,
			});
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
			200: t.Object({ message: t.String() }),
			400: UploadModel.errorResponse,
			401: UploadModel.errorResponse,
			404: UploadModel.errorResponse,
			403: UploadModel.unauthorized,
			500: UploadModel.errorResponse,
			503: UploadModel.errorResponse,
		},
		detail: {
			summary: "Delete file",
			description: "Deletes an uploaded file (soft delete)",
		},
	},
);
