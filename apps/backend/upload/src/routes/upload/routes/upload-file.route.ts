import type { AuthenticatedUser } from "@verifio/upload/middleware/auth";
import { uploadErrorResponse } from "@verifio/upload/error/upload.error-response";
import { authMiddleware } from "@verifio/upload/middleware/auth";
import { UploadModel } from "@verifio/upload/model/upload.model";
import { uploadFileHandler } from "@verifio/upload/routes/upload/controllers/upload-file";
import { Elysia } from "elysia";

export const uploadFileRoute = new Elysia().use(authMiddleware).post(
	"/upload",
	async ({ request, user }) => {
		const typedUser = user as AuthenticatedUser;
		const { id: userId, activeOrganizationId } = typedUser;
		const formData = await request.formData();
		const file = formData.get("file") as File | null;

		if (!file) {
			return uploadErrorResponse("No file provided");
		}

		try {
			return await uploadFileHandler({
				userId,
				organizationId: activeOrganizationId,
				file: file as File,
			});
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			return uploadErrorResponse(errorMessage);
		}
	},
	{
		auth: true,
		response: {
			200: UploadModel.uploadResponse,
			400: UploadModel.errorResponse,
			401: UploadModel.errorResponse,
			404: UploadModel.errorResponse,
			403: UploadModel.unauthorized,
			500: UploadModel.errorResponse,
			503: UploadModel.errorResponse,
		},
		detail: {
			summary: "Upload file",
			description: "Uploads an image file and returns file metadata with URL",
		},
	},
);
