import { checkDisposable, getDisposableCount } from "@verifio/email-verify";
import { logger } from "@verifio/logger";

export async function checkDisposableHandler(email: string) {
	const startTime = Date.now();

	const domainMatch = email.match(/@([^@]+)$/);
	if (!domainMatch) {
		return {
			success: false,
			error: "Invalid email format",
		};
	}

	const domain = domainMatch[1]?.toLowerCase();

	const result = checkDisposable(domain);

	const databaseSize = getDisposableCount();

	logger.info(
		{
			email,
			domain,
			isDisposable: result.isDisposable,
			provider: result.provider,
			duration: Date.now() - startTime,
		},
		"Disposable email check completed",
	);

	return {
		success: true,
		data: {
			email,
			isDisposable: result.isDisposable,
			domain,
			provider: result.provider || null,
			databaseSize,
			lastUpdated: new Date().toISOString(),
		},
	};
}
