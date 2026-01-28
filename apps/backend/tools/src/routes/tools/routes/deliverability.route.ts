/**
 * Email Deliverability Testing Route
 */

import { checkDns, detectSmtpProvider } from "@verifio/email-verify";
import { logger } from "@verifio/logger";
import { createRateLimiter } from "@verifio/tools/lib/rate-limiter";
import { resolveMx, resolveTxt } from "dns/promises";
import { Elysia, t } from "elysia";

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

async function checkSPFRecord(domain: string): Promise<{
  pass: boolean;
  record: string | null;
}> {
  try {
    const txtRecords = await resolveTxt(domain);
    const flattenedRecords = txtRecords.flat();
    const spfRecord = flattenedRecords.find((record) =>
      record.startsWith("v=spf1"),
    );
    if (spfRecord) {
      return { pass: true, record: spfRecord };
    }
    return { pass: false, record: null };
  } catch {
    return { pass: false, record: null };
  }
}

async function checkDMARCRecord(domain: string): Promise<{
  pass: boolean;
  record: string | null;
  policy: string | null;
}> {
  try {
    const dmarcDomain = `_dmarc.${domain}`;
    const txtRecords = await resolveTxt(dmarcDomain);
    const flattenedRecords = txtRecords.flat();
    const dmarcRecord = flattenedRecords.find((record) =>
      record.startsWith("v=DMARC1"),
    );
    if (dmarcRecord) {
      const policyMatch = dmarcRecord.match(/p=([a-z]+)/i);
      const policy = policyMatch?.[1] ?? null;
      return { pass: true, record: dmarcRecord, policy };
    }
    return { pass: false, record: null, policy: null };
  } catch {
    return { pass: false, record: null, policy: null };
  }
}

async function checkDKIMRecord(domain: string): Promise<{
  pass: boolean;
  record: string | null;
  message: string;
}> {
  try {
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
      } catch { }
    }
    return {
      pass: false,
      record: null,
      message: "Could not find DKIM record",
    };
  } catch {
    return {
      pass: false,
      record: null,
      message: "DKIM check failed",
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

        let score = 0;
        const risks: string[] = [];
        const recommendations: string[] = [];

        // Get MX records with full priority information (not from checkDns which only returns strings)
        let mxRecordsRaw: Array<{ priority: number; exchange: string }> = [];
        try {
          mxRecordsRaw = await resolveMx(normalizedDomain);
          mxRecordsRaw = mxRecordsRaw.sort((a, b) => a.priority - b.priority);
        } catch { }

        // Check domain exists
        let domainExistsResult: { pass: boolean; value: string[] };
        let mxRecordsResult: {
          pass: boolean;
          records: Array<{ priority: number; exchange: string }>;
        };

        try {
          const dnsCheck = await checkDns(normalizedDomain);
          domainExistsResult = {
            pass: dnsCheck.domainExists,
            value: dnsCheck.mxRecords || [normalizedDomain],
          };
          mxRecordsResult = {
            pass: dnsCheck.hasMx || false,
            records: mxRecordsRaw,
          };
          if (dnsCheck.domainExists) {
            score += 20;
          } else {
            risks.push("Domain does not exist in DNS");
          }
          if (dnsCheck.hasMx) {
            score += 25;
          } else {
            risks.push("No MX records found");
            recommendations.push("Add MX records for your domain");
          }
        } catch {
          domainExistsResult = { pass: false, value: [] };
          mxRecordsResult = { pass: false, records: [] };
          risks.push("Domain DNS lookup failed");
        }

        const spfRecord = await checkSPFRecord(normalizedDomain);
        if (spfRecord.pass) {
          score += 20;
        } else {
          risks.push("No SPF record found");
          recommendations.push("Add an SPF record");
        }

        const dmarcRecord = await checkDMARCRecord(normalizedDomain);
        if (dmarcRecord.pass) {
          score += 20;
        } else {
          risks.push("No DMARC record found");
          recommendations.push("Add a DMARC record");
        }

        const dkimRecord = await checkDKIMRecord(normalizedDomain);
        if (dkimRecord.pass) {
          score += 15;
        } else {
          risks.push("No DKIM record found");
          recommendations.push("Add DKIM signing");
        }

        let provider: string | null = null;
        try {
          const dnsCheck = await checkDns(normalizedDomain);
          if (dnsCheck.mxRecords && dnsCheck.mxRecords.length > 0) {
            provider = detectSmtpProvider(dnsCheck.mxRecords);
          }
        } catch { }

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
        logger.error(
          { error, domain: (body as { domain: string }).domain },
          "Deliverability test failed",
        );
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
        summary: "Test deliverability",
        description:
          "Tests domain deliverability configuration (DNS, MX, SPF, DKIM, DMARC)",
      },
    },
  );
