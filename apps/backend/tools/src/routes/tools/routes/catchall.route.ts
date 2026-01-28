import { resolveMx } from "node:dns/promises";
import { Socket } from "node:net";
import { logger } from "@verifio/logger";
import { createRateLimiter } from "@verifio/tools/lib/rate-limiter";
import { Elysia, t } from "elysia";

const CatchallDetectBody = t.Object({
	domain: t.String({
		minLength: 1,
		maxLength: 255,
		description: "Domain to test for catch-all configuration",
	}),
});

const CatchallDetectResponse = t.Object({
	success: t.Boolean(),
	data: t.Optional(
		t.Object({
			domain: t.String(),
			isCatchAll: t.Boolean(),
			confidence: t.Union([
				t.Literal("high"),
				t.Literal("medium"),
				t.Literal("low"),
			]),
			testEmail: t.String(),
			smtpResponse: t.Union([t.String(), t.Null()]),
			explanation: t.String(),
			implications: t.Array(t.String()),
			recommendations: t.Array(t.String()),
		}),
	),
	error: t.Optional(t.String()),
});

async function testCatchAllSMTP(domain: string): Promise<{
	isCatchAll: boolean;
	confidence: "high" | "medium" | "low";
	smtpResponse: string | null;
}> {
	return new Promise((resolve) => {
		const randomString = Math.random().toString(36).substring(2, 15);
		const testEmail = `test-${randomString}@${domain}`;

		resolveMx(domain)
			.then((mxRecords) => {
				if (!mxRecords || mxRecords.length === 0) {
					return resolve({
						isCatchAll: false,
						confidence: "low" as const,
						smtpResponse: "No MX records found",
					});
				}

				const sortedMx = [...mxRecords].sort((a, b) => a.priority - b.priority);
				const mxHost = sortedMx[0]?.exchange;

				if (!mxHost) {
					return resolve({
						isCatchAll: false,
						confidence: "low" as const,
						smtpResponse: "No valid MX host found",
					});
				}

				const socket = new Socket();
				let smtpResponse = "";
				let isCatchAll = false;
				let confidence: "high" | "medium" | "low" = "medium";

				const cleanup = () => {
					try {
						socket.destroy();
					} catch {}
				};

				socket.on("timeout", () => {
					cleanup();
					resolve({
						isCatchAll: false,
						confidence: "low",
						smtpResponse: "Connection timeout",
					});
				});

				socket.on("error", (error) => {
					cleanup();
					resolve({
						isCatchAll: false,
						confidence: "low",
						smtpResponse: error.message,
					});
				});

				socket.on("data", (data) => {
					smtpResponse += data.toString();
					const responseLines = smtpResponse.split("\n");
					const lastLine = responseLines[responseLines.length - 1] ?? "";

					if (lastLine.match(/^\d{3}/)) {
						cleanup();

						if (smtpResponse.includes("250")) {
							isCatchAll = true;
							confidence = "high";
						} else if (smtpResponse.includes("550")) {
							isCatchAll = false;
							confidence = "high";
						} else if (
							smtpResponse.includes("552") ||
							smtpResponse.includes("554")
						) {
							confidence = "low";
						}

						resolve({
							isCatchAll,
							confidence,
							smtpResponse: smtpResponse.trim(),
						});
					}
				});

				try {
					socket.connect(25, mxHost);

					setTimeout(() => {
						try {
							socket.write("EHLO verifio.email\r\n");
							setTimeout(() => {
								try {
									socket.write("MAIL FROM:<tools@verifio.email>\r\n");
									setTimeout(() => {
										try {
											socket.write(`RCPT TO:<${testEmail}>\r\n`);
										} catch {}
									}, 500);
								} catch {}
							}, 500);
						} catch {}
					}, 500);
				} catch (error) {
					cleanup();
					resolve({
						isCatchAll: false,
						confidence: "low",
						smtpResponse:
							error instanceof Error ? error.message : "Connection failed",
					});
				}

				setTimeout(() => {
					cleanup();
					if (!smtpResponse) {
						resolve({
							isCatchAll: false,
							confidence: "low",
							smtpResponse: "SMTP test timeout",
						});
					}
				}, 10000);
			})
			.catch((error) => {
				resolve({
					isCatchAll: false,
					confidence: "low",
					smtpResponse:
						error instanceof Error ? error.message : "DNS lookup failed",
				});
			});
	});
}

export const catchallRoute = new Elysia({ prefix: "/v1" })
	.use(createRateLimiter("catchall"))
	.post(
		"/catchall/detect",
		async ({ body }) => {
			const startTime = Date.now();
			try {
				const { domain } = body as { domain: string };
				const normalizedDomain = domain.toLowerCase().trim();

				const randomString = Math.random().toString(36).substring(2, 15);
				const testEmail = `test-${randomString}@${normalizedDomain}`;

				const smtpTest = await testCatchAllSMTP(normalizedDomain);

				const explanation = smtpTest.isCatchAll
					? "This domain appears to be configured as a catch-all (accept-all)."
					: "This domain does not appear to be a catch-all.";

				const implications = smtpTest.isCatchAll
					? [
							"Email verification cannot definitively determine if specific addresses exist",
							"All email addresses will appear 'valid' even if they don't exist",
							"Higher bounce rates possible",
						]
					: [
							"Email verification can reliably determine if addresses exist",
							"Non-existent addresses will be detected",
						];

				const recommendations = smtpTest.isCatchAll
					? [
							"Consider using double opt-in",
							"Monitor bounce rates",
							"Use engagement metrics to identify inactive addresses",
						]
					: [
							"Email verification will be effective for this domain",
							"Still recommended to verify emails before sending large campaigns",
						];

				logger.info(
					{
						domain: normalizedDomain,
						isCatchAll: smtpTest.isCatchAll,
						confidence: smtpTest.confidence,
						duration: Date.now() - startTime,
					},
					"Catch-all detection completed",
				);

				return {
					success: true,
					data: {
						domain: normalizedDomain,
						isCatchAll: smtpTest.isCatchAll,
						confidence: smtpTest.confidence,
						testEmail,
						smtpResponse: smtpTest.smtpResponse,
						explanation,
						implications,
						recommendations,
					},
				};
			} catch (error) {
				logger.error(
					{ error, domain: (body as { domain: string }).domain },
					"Catch-all detection failed",
				);
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to detect catch-all configuration",
				};
			}
		},
		{
			body: CatchallDetectBody,
			response: CatchallDetectResponse,
			detail: {
				summary: "Detect catch-all",
				description:
					"Tests if a domain is configured as catch-all (accept-all).",
			},
		},
	);
