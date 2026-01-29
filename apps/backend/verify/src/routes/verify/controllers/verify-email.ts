import { db } from "@verifio/db/client";
import * as schema from "@verifio/db/schema";
import { verifyEmail } from "@verifio/email-verify";
import { ActivityLogger, logger } from "@verifio/logger";
import {
	checkCredits,
	deductCredits,
} from "@verifio/verify/services/credits-client";
import type { VerifyTypes } from "@verifio/verify/types/verify.type";
import { verifyConfig } from "@verifio/verify/verify.config";

const VERIFICATION_TIMEOUT = 30000; // 30 seconds

// Create activity logger instance
const activityLogger = new ActivityLogger({ url: verifyConfig.logsUrl });

export async function verifyEmailHandler(
	organizationId: string,
	userId: string,
	apiKeyId: string | undefined,
	request: VerifyTypes.VerifyEmailRequest,
	ipAddress?: string,
	userAgent?: string,
	cookie?: string,
): Promise<VerifyTypes.VerifyEmailResponse | VerifyTypes.VerifyEmailError> {
	const startTime = Date.now();
	const requestId = crypto.randomUUID();

	try {
		// Check credits before verification
		const creditCheck = await checkCredits(organizationId, cookie);
		logger.info({ creditCheck }, "Checking credits before verification");

		if (creditCheck.success === false || !creditCheck.data?.hasCredits) {
			return {
				success: false as const,
				error: "Insufficient credits",
				requestId,
				data: {
					remaining: creditCheck.data?.remaining,
					required: creditCheck.data?.required,
				},
			};
		}

		logger.info(
			{ email: request.email, organizationId, userId },
			"Verifying single email (authenticated)",
		);

		// Add timeout to prevent hanging on slow SMTP servers
		const result = await Promise.race([
			verifyEmail(request.email, {
				skipDisposable: request.options?.skipDisposable === true,
				skipRole: request.options?.skipRole === true,
				skipTypo: request.options?.skipTypo === true,
			}),
			new Promise<never>((_, reject) =>
				setTimeout(
					() =>
						reject(new Error("Verification timeout - request took too long")),
					VERIFICATION_TIMEOUT,
				),
			),
		]);

		const duration = Date.now() - startTime;

		// Store result in database
		let resultId: string | undefined;
		try {
			const [inserted] = await db
				.insert(schema.verificationResult)
				.values({
					organizationId,
					userId,
					email: result.email,
					state: result.state,
					score: result.score,
					reason: result.reason,
					result: result,
				})
				.returning({ id: schema.verificationResult.id });

			resultId = inserted?.id;

			logger.info(
				{ email: request.email, organizationId, resultId },
				"Verification result stored in database",
			);
		} catch (dbError) {
			logger.error(
				{ error: dbError, email: request.email },
				"Failed to store verification result in database",
			);
		}

		// Deduct credits after successful verification
		const deductResult = await deductCredits(organizationId, 1, cookie);

		if (!deductResult.success) {
			logger.error(
				{ organizationId, error: deductResult.error },
				"Failed to deduct credits after verification",
			);
			// Return error - credits must be deducted for billing integrity
			return {
				success: false as const,
				error:
					"Verification completed but credits deduction failed. Please contact support.",
				requestId,
			};
		}

		// Log activity for tracking
		activityLogger
			.log(
				{
					service: "verify",
					endpoint: "/v1/verify",
					method: "POST",
					organization_id: organizationId,
					user_id: userId,
					api_key_id: apiKeyId,
					resource_type: "email",
					resource_id: request.email,
					status: "success",
					result: result.state,
					credits_used: 1,
					duration_ms: duration,
					ip_address: ipAddress,
					user_agent: userAgent,
				},
				{ cookie },
			)
			.catch(() => {});

		logger.info(
			{
				email: request.email,
				state: result.state,
				score: result.score,
				duration,
			},
			"Email verification completed",
		);

		return {
			success: true as const,
			data: {
				...result,
				id: resultId,
			},
			requestId,
		};
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";
		const duration = Date.now() - startTime;

		logger.error(
			{ email: request.email, error: errorMessage },
			"Email verification failed",
		);

		// Log failed activity
		activityLogger
			.log(
				{
					service: "verify",
					endpoint: "/v1/verify",
					method: "POST",
					organization_id: organizationId,
					user_id: userId,
					resource_type: "email",
					resource_id: request.email,
					status: "error",
					error_message: errorMessage,
					duration_ms: duration,
					ip_address: ipAddress,
					user_agent: userAgent,
				},
				{ cookie },
			)
			.catch(() => {});

		return {
			success: false as const,
			error: errorMessage,
			requestId,
		};
	}
}
