/**
 * Email Deliverability Testing Route
 * Tests domain deliverability configuration (DNS, MX, SPF, DKIM, DMARC)
 */

import { logger } from "@verifio/logger";
import {
	checkDns,
	detectSmtpProvider,
} from "@verifio/email-verify";
import { Elysia, t } from "elysia";
import { createRateLimiter } from "../lib/rate-limiter";
import { resolveTxt } from "dns/promises";

// Request schema
const DeliverabilityTestBody = t.Object({
	domain: t.String({
		minLength: 1,
		maxLength: 255,
		description: "Domain to test for deliverability",
	}),
});

// Response schema
const DeliverabilityTestResponse = t.Object({
	success: t.Boolean(),
	data: t.Optional(
		t.Object({
			domain: t.String(),
			overallScore: t.Number(),
			checks: t.Object({
				domainExists: t.Object({
					pass: t.Boolean(),
					value: t.Array(t.String()),
				}),
				mxRecords: t.Object({
					pass: t.Boolean(),
					records: t.Array(
						t.Object({
							priority: t.Number(),
							exchange: t.String(),
						}),
					),
				}),
				spfRecord: t.Object({
					pass: t.Boolean(),
					record: t.Union([t.String(), t.Null()]),
				}),
				dkimRecord: t.Object({
					pass: t.Boolean(),
					record: t.Union([t.String(), t.Null()]),
					message: t.String(),
				}),
				dmarcRecord: t.Object({
					pass: t.Boolean(),
					record: t.Union([t.String(), t.Null()]),
					policy: t.Union([t.String(), t.Null()]),
				}),
				provider: t.Union([t.String(), t.Null()]),
			}),
			risks: t.Array(t.String()),
			recommendations: t.Array(t.String()),
		}),
	),
	error: t.Optional(t.String()),
});

/**
 * Check SPF record for a domain
 */
async function checkSPFRecord(domain: string): Promise<{
	pass: boolean;
	record: string | null;
}> {
	try {
		const txtRecords = await resolveTxt(domain);
		// Flatten TXT records (resolveTxt returns arrays of strings)
		const flattenedRecords = txtRecords.flat();

		const spfRecord = flattenedRecords.find((record) =>
			record.startsWith("v=spf1"),
		);

		if (spfRecord) {
			return { pass: true, record: spfRecord };
		}

		return { pass: false, record: null };
	} catch (error) {
		logger.debug({ error, domain }, "SPF record check failed");
		return { pass: false, record: null };
	}
}

/**
 * Check DMARC record for a domain
 */
async function checkDMARCRecord(domain: string): Promise<{
	pass: boolean;
	record: string | null;
	policy: string | null;
}> {
	try {
		// DMARC records are at _dmarc.domain
		const dmarcDomain = `_dmarc.${domain}`;
		const txtRecords = await resolveTxt(dmarcDomain);
		const flattenedRecords = txtRecords.flat();

		const dmarcRecord = flattenedRecords.find((record) =>
			record.startsWith("v=DMARC1"),
		);

		if (dmarcRecord) {
			// Extract policy (p=tag)
			const policyMatch = dmarcRecord.match(/p=([a-z]+)/i);
			const policy = policyMatch ? policyMatch[1] : null;

			return { pass: true, record: dmarcRecord, policy };
		}

		return { pass: false, record: null, policy: null };
	} catch (error) {
		logger.debug({ error, domain }, "DMARC record check failed");
		return { pass: false, record: null, policy: null };
	}
}

/**
 * Check DKIM record for a domain
 * Note: DKIM is complex as it uses selectors. This is a basic check.
 */
async function checkDKIMRecord(domain: string): Promise<{
	pass: boolean;
	record: string | null;
	message: string;
}> {
	try {
		// Try common selector names
		const commonSelectors = ["default", "google", "k1", "smtp"];

		for (const selector of commonSelectors) {
			const dkimDomain = `${selector}._domainkey.${domain}`;
			try {
				const txtRecords = await resolveTxt(dkimDomain);
				const flattenedRecords = txtRecords.flat();

				const dkimRecord = flattenedRecords.find((record) =>
					record.includes("p="),
				);

				if (dkimRecord) {
					return {
						pass: true,
						record: dkimRecord,
						message: `Found DKIM record with selector '${selector}'`,
					};
				}
			} catch {
				// Continue to next selector
				continue;
			}
		}

		return {
			pass: false,
			record: null,
			message:
				"Could not find DKIM record. Note: DKIM requires a selector, try common ones like 'default', 'google', 'k1', or check your provider's documentation.",
		};
	} catch (error) {
		logger.debug({ error, domain }, "DKIM record check failed");
		return {
			pass: false,
			record: null,
			message: "DKIM check failed or no DKIM records found",
		};
	}
}

export const deliverabilityRoute = new Elysia({ prefix: "/v1" })
	.use(createRateLimiter("deliverability"))
	.post(
		"/deliverability/test",
		async ({ body }) => {
			const startTime = Date.now();

			try {
				const { domain } = body as { domain: string };
				const normalizedDomain = domain.toLowerCase().trim();

				// Initialize score
				let score = 0;
				const risks: string[] = [];
				const recommendations: string[] = [];

				// 1. Check domain exists (DNS resolution)
				let domainExistsResult: { pass: boolean; value: string[] };
				try {
					const dnsCheck = await checkDns(normalizedDomain);
					domainExistsResult = {
						pass: dnsCheck.domainExists,
						value: dnsCheck.hasMx
							? dnsCheck.mxRecords?.map((mx) => mx.exchange) || []
							: [normalizedDomain],
					};
					if (dnsCheck.domainExists) {
						score += 20;
					} else {
						risks.push("Domain does not exist in DNS");
					}
				} catch (error) {
					domainExistsResult = { pass: false, value: [] };
					risks.push("Domain DNS lookup failed");
				}

				// 2. Check MX records
				let mxRecordsResult: {
					pass: boolean;
					records: Array<{ priority: number; exchange: string }>;
				};
				try {
					const dnsCheck = await checkDns(normalizedDomain);
					mxRecordsResult = {
						pass: dnsCheck.hasMx || false,
						records: dnsCheck.mxRecords || [],
					};
					if (dnsCheck.hasMx) {
						score += 25;
					} else {
						risks.push("No MX records found - email delivery may fail");
						recommendations.push("Add MX records for your domain");
					}
				} catch (error) {
					mxRecordsResult = { pass: false, records: [] };
					risks.push("MX record lookup failed");
				}

				// 3. Check SPF record
				const spfRecord = await checkSPFRecord(normalizedDomain);
				if (spfRecord.pass) {
					score += 20;
				} else {
					risks.push("No SPF record found - emails may be marked as spam");
					recommendations.push("Add an SPF record to authorize email servers");
				}

				// 4. Check DMARC record
				const dmarcRecord = await checkDMARCRecord(normalizedDomain);
				if (dmarcRecord.pass) {
					score += 20;
					if (dmarcRecord.policy === "none") {
						recommendations.push(
							"Consider changing DMARC policy from 'none' to 'quarantine' or 'reject' for better security",
						);
					}
				} else {
					risks.push("No DMARC record found - missing important security layer");
					recommendations.push(
						"Add a DMARC record to prevent email spoofing",
					);
				}

				// 5. Check DKIM record
				const dkimRecord = await checkDKIMRecord(normalizedDomain);
				if (dkimRecord.pass) {
					score += 15;
				} else {
					risks.push("No DKIM record found");
					recommendations.push(
						"Add DKIM signing for better email authentication",
					);
				}

				// 6. Detect provider
				let provider: string | null = null;
				try {
					const dnsCheck = await checkDns(normalizedDomain);
					if (dnsCheck.mxRecords && dnsCheck.mxRecords.length > 0) {
						provider = detectSmtpProvider(dnsCheck.mxRecords);
					}
				} catch (error) {
					logger.debug({ error, domain: normalizedDomain }, "Provider detection failed");
				}

				logger.info(
					{
						domain: normalizedDomain,
						score,
						provider,
						duration: Date.now() - startTime,
					},
					"Deliverability test completed",
				);

				return {
					success: true,
					data: {
						domain: normalizedDomain,
						overallScore: score,
						checks: {
							domainExists: domainExistsResult,
							mxRecords: mxRecordsResult,
							spfRecord,
							dkimRecord,
							dmarcRecord,
							provider,
						},
						risks,
						recommendations,
					},
				};
			} catch (error) {
				logger.error({ error, domain: (body as { domain: string }).domain }, "Deliverability test failed");

				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to test deliverability",
				};
			}
		},
		{
			body: DeliverabilityTestBody,
			response: DeliverabilityTestResponse,
			detail: {
				summary: "Test email deliverability",
				description:
					"Tests if a domain is properly configured for email deliverability. Checks DNS, MX records, SPF, DKIM, and DMARC configuration.",
				tags: ["Deliverability"],
			},
		},
	);
