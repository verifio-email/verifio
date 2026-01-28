import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import logger from "@verifio/logger";
import { and, eq, isNull } from "drizzle-orm";
import { status } from "elysia";

export async function deleteFile(params: {
	fileId: string;
	userId: string;
	organizationId: string;
}): Promise<{ message: string }> {
	const { fileId, userId, organizationId } = params;
	try {
		// Get file metadata from database
		const fileRecord = await db
			.select()
			.from(schema.upload)
			.where(and(eq(schema.upload.id, fileId), isNull(schema.upload.deletedAt)))
			.limit(1);

		if (fileRecord.length === 0 || !fileRecord[0]) {
			logger.warn({ fileId }, "File not found");
			throw new Error("File not found");
		}

		const upload = fileRecord[0];

		// Check if the file belongs to the user's organization
		if (upload.organizationId !== organizationId) {
			logger.warn(
				{ fileId, userId, organizationId, fileOrgId: upload.organizationId },
				"User attempted to delete file from different organization",
			);
			throw status(403, { message: "You don't have permission to delete this file" });
		}

		// Soft delete in database
		await db
			.update(schema.upload)
			.set({
				deletedAt: new Date(),
				updatedAt: new Date(),
			})
			.where(eq(schema.upload.id, fileId));

		logger.info(
			{
				fileId,
				userId,
				organizationId,
				path: upload.path,
			},
			"File deleted successfully",
		);

		return { message: "File deleted successfully" };
	} catch (error) {
		logger.error(
			{
				fileId,
				userId,
				organizationId,
				error: error instanceof Error ? error.message : String(error),
			},
			"Error deleting file",
		);
		if (error instanceof Error && error.message.includes("File not found")) {
			throw status(404, { message: "File not found" });
		}
		throw error;
	}
}

export async function deleteFileHandler(params: {
	fileId: string;
	userId: string;
	organizationId: string;
}): Promise<{ message: string }> {
	const { fileId, userId, organizationId } = params;
	const result = await deleteFile({
		fileId,
		userId,
		organizationId,
	});
	return result;
}
