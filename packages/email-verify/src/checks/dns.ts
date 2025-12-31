/**
 * DNS/MX Record Verification
 * Check if domain exists and has valid mail servers
 */

import { resolve, resolveMx } from "node:dns/promises";
import type { DnsCheckResult } from "../types";

/**
 * Check DNS records for a domain
 */
export async function checkDns(
  domain: string,
  timeout = 5000,
): Promise<DnsCheckResult> {
  const result: DnsCheckResult = {
    valid: false,
    domainExists: false,
    hasMx: false,
    mxRecords: [],
  };

  try {
    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("DNS lookup timeout")), timeout);
    });

    // Check MX records first (most important for email)
    try {
      const mxRecords = await Promise.race([resolveMx(domain), timeoutPromise]);

      if (mxRecords && mxRecords.length > 0) {
        // Sort by priority (lower = higher priority)
        const sortedMx = mxRecords.sort((a, b) => a.priority - b.priority);

        result.domainExists = true;
        result.hasMx = true;
        result.mxRecords = sortedMx.map((mx) => mx.exchange);
        result.preferredMx = sortedMx[0]?.exchange;
        result.valid = true;
        return result;
      }
    } catch (mxError) {
      // MX lookup failed, try A records as fallback
      // Some mail servers are configured without MX records
    }

    // Fallback: Check A records (domain exists)
    try {
      const aRecords = await Promise.race([resolve(domain, "A"), timeoutPromise]);

      if (aRecords && aRecords.length > 0) {
        result.domainExists = true;
        // Domain exists but no MX - can still receive mail in some cases
        // but it's not recommended/reliable
        result.valid = true; // Domain exists, but deliverability is uncertain
        return result;
      }
    } catch (aError) {
      // A record lookup failed
    }

    // Try AAAA records (IPv6)
    try {
      const aaaaRecords = await Promise.race([
        resolve(domain, "AAAA"),
        timeoutPromise,
      ]);

      if (aaaaRecords && aaaaRecords.length > 0) {
        result.domainExists = true;
        result.valid = true;
        return result;
      }
    } catch (aaaaError) {
      // AAAA record lookup failed
    }

    // Domain doesn't exist
    result.error = "Domain does not exist or has no DNS records";
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Check for specific DNS errors
    if (errorMessage.includes("ENOTFOUND") || errorMessage.includes("ENODATA")) {
      result.error = "Domain does not exist";
    } else if (errorMessage.includes("ETIMEOUT") || errorMessage.includes("timeout")) {
      result.error = "DNS lookup timed out";
    } else if (errorMessage.includes("ESERVFAIL")) {
      result.error = "DNS server failed to respond";
    } else {
      result.error = `DNS error: ${errorMessage}`;
    }

    return result;
  }
}

/**
 * Extract SMTP provider from MX records
 */
export function detectSmtpProvider(mxRecords: string[]): string | null {
  if (!mxRecords || mxRecords.length === 0) {
    return null;
  }

  const firstMx = mxRecords[0];
  if (!firstMx) return null;
  const preferredMx = firstMx.toLowerCase();

  // Google Workspace / Gmail
  if (
    preferredMx.includes("google") ||
    preferredMx.includes("googlemail") ||
    preferredMx.includes("aspmx") ||
    preferredMx.includes("gmail")
  ) {
    return "Google";
  }

  // Microsoft 365 / Outlook
  if (
    preferredMx.includes("outlook") ||
    preferredMx.includes("microsoft") ||
    preferredMx.includes("office365") ||
    preferredMx.includes("protection.outlook")
  ) {
    return "Microsoft 365";
  }

  // Yahoo
  if (preferredMx.includes("yahoo") || preferredMx.includes("yahoodns")) {
    return "Yahoo";
  }

  // Zoho
  if (preferredMx.includes("zoho")) {
    return "Zoho";
  }

  // ProtonMail
  if (preferredMx.includes("protonmail") || preferredMx.includes("proton")) {
    return "ProtonMail";
  }

  // Amazon SES
  if (preferredMx.includes("amazonses") || preferredMx.includes("inbound-smtp")) {
    return "Amazon SES";
  }

  // SendGrid
  if (preferredMx.includes("sendgrid")) {
    return "SendGrid";
  }

  // Mailgun
  if (preferredMx.includes("mailgun")) {
    return "Mailgun";
  }

  // Postmark
  if (preferredMx.includes("postmarkapp")) {
    return "Postmark";
  }

  // Fastmail
  if (preferredMx.includes("fastmail") || preferredMx.includes("messagingengine")) {
    return "FastMail";
  }

  // Mimecast
  if (preferredMx.includes("mimecast")) {
    return "Mimecast";
  }

  // Barracuda
  if (preferredMx.includes("barracuda")) {
    return "Barracuda";
  }

  // GoDaddy
  if (preferredMx.includes("secureserver") || preferredMx.includes("godaddy")) {
    return "GoDaddy";
  }

  // Rackspace
  if (preferredMx.includes("emailsrvr") || preferredMx.includes("rackspace")) {
    return "Rackspace";
  }

  // OVH
  if (preferredMx.includes("ovh")) {
    return "OVH";
  }

  // Yandex
  if (preferredMx.includes("yandex")) {
    return "Yandex";
  }

  // Mail.ru
  if (preferredMx.includes("mail.ru")) {
    return "Mail.ru";
  }

  // iCloud
  if (preferredMx.includes("icloud") || preferredMx.includes("me.com")) {
    return "iCloud";
  }

  return null;
}
