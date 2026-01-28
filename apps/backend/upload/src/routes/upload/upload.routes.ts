import { authMiddleware } from "@verifio/upload/middleware/auth";
import { deleteFileRoute } from "@verifio/upload/routes/upload/routes/delete-file.route";
import { getFileRoute } from "@verifio/upload/routes/upload/routes/get-file.route";
import { uploadFileRoute } from "@verifio/upload/routes/upload/routes/upload-file.route";
import { Elysia } from "elysia";

export const uploadRoutes = new Elysia({ prefix: "/v1", name: "UploadRoutes" })
	.use(authMiddleware)
	.use(uploadFileRoute)
	.use(getFileRoute)
	.use(deleteFileRoute);
