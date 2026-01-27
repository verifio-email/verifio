/**
 * Catch-All Domain Checker Route
 * Detects if a domain is configured as catch-all (accept-all)
 */

import { checkDns } from "@verifio/email-verify";
import { logger } from "@verifio/logger";
import { Elysia, t } from "elysia";
import { Socket } from "net";
import { createRateLimiter } from "../lib/rate-limiter";

// Request schema
const CatchallDetectBody = t.Object({
	domain: t.String({
		minLength: 1,
		maxLength: 255,
		description: "Domain to test for catch-all configuration",
	}),
});

// Response schema
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

/**
 * Test if domain is catch-all using SMTP handshake
 * Sends a test email with a random local part to see if the server accepts it
 */
async function testCatchAllSMTP(domain: string): Promise<{
	isCatchAll: boolean;
	confidence: "high" | "medium" | "low";
	smtpResponse: string | null;
}> {
	return new Promise((resolve) => {
		// Generate a random email address that's extremely unlikely to exist
		const randomString = Math.random().toString(36).substring(2, 15);
		const testEmail = `test-${randomString}@${domain}`;

		// First, get MX records
		checkDns(domain)
			.then((dnsCheck) => {
				if (
					!dnsCheck.hasMx ||
					!dnsCheck.mxRecords ||
					dnsCheck.mxRecords.length === 0
				) {
					return resolve({
						isCatchAll: false,
						confidence: "low" as const,
						smtpResponse: "No MX records found",
					});
				}

				// Try the lowest priority MX record (highest preference number)
				const mxRecords = [...dnsCheck.mxRecords].sort(
					(a, b) => a.priority - b.priority,
				);
				const mxHost = mxRecords[0].exchange;

				// Create SMTP connection
				const socket = new Socket();

				let smtpResponse = "";
				let isCatchAll = false;
				let confidence: "high" | "medium" | "low" = "medium";

				const cleanup = () => {
					try {
						socket.destroy();
					} catch {
						// Ignore
					}
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

				socket.on("connect", () => {
					// Wait for server greeting
					// SMTP server sends greeting first
				});

				socket.on("data", (data) => {
					smtpResponse += data.toString();

					const responseText = smtpResponse.toLowerCase();
					const responseLines = smtpResponse.split("\n");
					const lastLine = responseLines[responseLines.length - 1];

					// Check if we got a complete response (SMTP responses end with status code)
					if (lastLine.match(/^\d{3}/)) {
						cleanup();

						// Analyze SMTP response
						// Catch-all servers typically accept the email with 250
						// Non-catch-all servers typically reject with 550
						if (smtpResponse.includes("250")) {
							isCatchAll = true;
							confidence = "high";
						} else if (
							smtpResponse.includes("550") ||
							smtpResponse.includes("550")
						) {
							isCatchAll = false;
							confidence = "high";
						} else if (
							smtpResponse.includes("552") ||
							smtpResponse.includes("554")
						) {
							// Mailbox full or service unavailable - can't determine
							confidence = "low";
						}

						resolve({
							isCatchAll,
							confidence,
							smtpResponse: smtpResponse.trim(),
						});
					}
				});

				// Try to connect to SMTP server
				try {
					socket.connect(25, mxHost);

					// Send SMTP commands after a short delay
					setTimeout(() => {
						try {
							// Send EHLO
							socket.write("EHLO verifio.email\r\n");

							// Send MAIL FROM
							setTimeout(() => {
								try {
									socket.write("MAIL FROM:<tools@verifio.email>\r\n");

									// Send RCPT TO with the test email
									setTimeout(() => {
										try {
											socket.write(`RCPT TO:<${testEmail}>\r\n`);
										} catch {
											// Socket might be closed
										}
									}, 500);
								} catch {
									// Socket might be closed
								}
							}, 500);
						} catch {
							// Socket might be closed
						}
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

				// Set a timeout to prevent hanging
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

				// Generate test email
				const randomString = Math.random().toString(36).substring(2, 15);
				const testEmail = `test-${randomString}@${normalizedDomain}`;

				// Test for catch-all
				const smtpTest = await testCatchAllSMTP(normalizedDomain);

				// Build explanation
				const explanation = smtpTest.isCatchAll
					? "This domain appears to be configured as a catch-all (accept-all). This means it accepts emails sent to any address, even non-existent ones."
					: "This domain does not appear to be a catch-all. It likely only accepts emails for specific, configured mailboxes.";

				// Build implications
				const implications = smtpTest.isCatchAll
					? [
							"Email verification cannot definitively determine if specific addresses exist",
							"All email addresses will appear 'valid' even if they don't exist",
							"Higher bounce rates possible when sending to unconfirmed addresses",
							"Common in business email setups and some email providers",
						]
					: [
							"Email verification can reliably determine if addresses exist",
							"Non-existent addresses will be detected and rejected",
							"Lower bounce rates when sending verified addresses",
						];

				// Build recommendations
				const recommendations = smtpTest.isCatchAll
					? [
							"Consider using double opt-in for email signup forms",
							"Monitor bounce rates and remove addresses that bounce repeatedly",
							"Use engagement metrics (opens, clicks) to identify inactive addresses",
							"Consider implementing a confirmation email before adding to lists",
						]
					: [
							"Email verification will be effective for this domain",
							"Still recommended to verify emails before sending large campaigns",
							"Use real-time verification at signup to catch typos",
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
				summary: "Detect catch-all domain",
				description:
					"Tests if a domain is configured as catch-all (accept-all). Catch-all domains accept emails for any address, making verification difficult.",
				tags: ["Catch-All"],
			},
		},
	);
