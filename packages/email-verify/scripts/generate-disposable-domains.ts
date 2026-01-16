#!/usr/bin/env npx tsx
/**
 * Disposable Domain List Generator
 *
 * Fetches and merges disposable email domains from multiple sources:
 * 1. FakeFilter (https://github.com/7c/fakefilter) - Daily updated, with provider info
 * 2. disposable-email-domains (https://github.com/disposable-email-domains/disposable-email-domains)
 * 3. disposable (https://github.com/disposable/disposable-email-domains)
 *
 * Run with: npx tsx scripts/generate-disposable-domains.ts
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";

// Use process.cwd() since this script is always run from the package root
// (e.g., npx tsx scripts/generate-disposable-domains.ts)
const PACKAGE_ROOT = process.cwd();

const SOURCES = {
	fakeFilter:
		"https://raw.githubusercontent.com/7c/fakefilter/main/json/data.json",
	disposableEmailDomains:
		"https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/main/disposable_email_blocklist.conf",
	disposable:
		"https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.txt",
};

interface FakeFilterData {
	version: number;
	t: number;
	domains: Record<
		string,
		{
			provider: string;
			firstseen: number;
			lastseen: number;
		}
	>;
}

async function fetchFakeFilter(): Promise<{
	domains: Set<string>;
	providers: Map<string, string>;
}> {
	console.log("📥 Fetching FakeFilter data...");
	const response = await fetch(SOURCES.fakeFilter);
	const data: FakeFilterData = await response.json();

	const domains = new Set<string>();
	const providers = new Map<string, string>();

	for (const [domain, info] of Object.entries(data.domains)) {
		domains.add(domain.toLowerCase());
		if (info.provider) {
			providers.set(domain.toLowerCase(), info.provider);
		}
	}

	console.log(`   ✓ FakeFilter: ${domains.size} domains`);
	return { domains, providers };
}

async function fetchDisposableEmailDomains(): Promise<Set<string>> {
	console.log("📥 Fetching disposable-email-domains...");
	const response = await fetch(SOURCES.disposableEmailDomains);
	const text = await response.text();

	const domains = new Set<string>();
	for (const line of text.split("\n")) {
		const trimmed = line.trim().toLowerCase();
		if (trimmed && !trimmed.startsWith("#")) {
			domains.add(trimmed);
		}
	}

	console.log(`   ✓ disposable-email-domains: ${domains.size} domains`);
	return domains;
}

async function fetchDisposable(): Promise<Set<string>> {
	console.log("📥 Fetching disposable/disposable-email-domains...");
	const response = await fetch(SOURCES.disposable);
	const text = await response.text();

	const domains = new Set<string>();
	for (const line of text.split("\n")) {
		const trimmed = line.trim().toLowerCase();
		if (trimmed && !trimmed.startsWith("#")) {
			domains.add(trimmed);
		}
	}

	console.log(`   ✓ disposable: ${domains.size} domains`);
	return domains;
}

function generateProviderMap(providers: Map<string, string>): string {
	// Group domains by provider and format nicely
	const wellKnownProviders: Map<string, string> = new Map([
		["10minutemail.com", "10 Minute Mail"],
		["guerrillamail.com", "Guerrilla Mail"],
		["mailinator.com", "Mailinator"],
		["tempmail.com", "Temp Mail"],
		["temp-mail.org", "Temp Mail"],
		["yopmail.com", "YOPmail"],
		["maildrop.cc", "Maildrop"],
		["throwaway.email", "Throwaway Email"],
		["trashmail.com", "Trash Mail"],
		["fakeinbox.com", "Fake Inbox"],
		["getnada.com", "Nada"],
		["sharklasers.com", "Shark Lasers"],
		["spam4.me", "Spam4.me"],
		["mailnesia.com", "Mailnesia"],
		["dispostable.com", "Dispostable"],
		["dropmail.me", "Dropmail"],
		["emailondeck.com", "Email On Deck"],
	]);

	// Add FakeFilter providers (mapping provider identifier to friendly name)
	const providerNames: Record<string, string> = {
		"guerrillamail.com": "Guerrilla Mail",
		"yopmail.com": "YOPmail",
		"yopmail.net": "YOPmail",
		"dropmail.me": "Dropmail",
		"tempmail.plus": "Temp Mail Plus",
		"tempmail.io": "Temp Mail",
		"tempail.com": "Tempail",
		"mail.td": "Mail.td",
		"txen.de": "Txen",
		"spoofmail.de": "Spoofmail",
		"emailfake.com": "Email Fake",
		"email-fake.com": "Email Fake",
		"generator.email": "Generator Email",
		"mail-temp.com": "Mail Temp",
		"mail.gw": "Mail.gw",
		"24hour.email": "24 Hour Email",
		"temporarymail.com": "Temporary Mail",
		"trash-mail.com": "Trash Mail",
		"anonmails.de": "Anon Mails",
		"mail4qa.com": "Mail4QA",
		"moakt.com": "Moakt",
		"niepodam.pl": "Niepodam",
		"mailswipe.net": "Mailswipe",
		"fakemail.net": "Fake Mail",
		"maildim.com": "Maildim",
		"disposeamail.com": "Disposeamail",
		"wegwerfemailadresse.com": "Wegwerf Email",
		"easytrashmail.com": "Easy Trash Mail",
		"muellmail.com": "Müllmail",
		"mailnesia.com": "Mailnesia",
		"lroid.com": "Lroid",
		"tempmail.cn": "Temp Mail CN",
		"default.tmail.thehp.in": "TMail",
	};

	// Merge with FakeFilter data
	for (const [domain, providerKey] of providers.entries()) {
		if (!wellKnownProviders.has(domain)) {
			const friendlyName =
				providerNames[providerKey] ||
				providerKey
					.replace(/.com$|.net$|.org$/i, "")
					.replace(/[-_]/g, " ")
					.replace(/\b\w/g, (c) => c.toUpperCase());
			wellKnownProviders.set(domain, friendlyName);
		}
	}

	// Sort and format
	const entries = Array.from(wellKnownProviders.entries()).sort(([a], [b]) =>
		a.localeCompare(b),
	);

	return entries
		.map(([domain, name]) => `  ["${domain}", "${name}"]`)
		.join(",\n");
}

async function main() {
	console.log("🚀 Generating disposable domains list...\n");

	// Fetch all sources
	const [fakeFilter, disposableEmailDomains, disposable] = await Promise.all([
		fetchFakeFilter(),
		fetchDisposableEmailDomains(),
		fetchDisposable(),
	]);

	// Merge all domains
	const allDomains = new Set<string>();

	for (const domain of fakeFilter.domains) {
		allDomains.add(domain);
	}
	for (const domain of disposableEmailDomains) {
		allDomains.add(domain);
	}
	for (const domain of disposable) {
		allDomains.add(domain);
	}

	console.log(`\n📊 Total unique domains: ${allDomains.size}`);

	// Sort domains alphabetically
	const sortedDomains = Array.from(allDomains).sort();

	// Generate the TypeScript file content
	const timestamp = new Date().toISOString();
	const providerMapContent = generateProviderMap(fakeFilter.providers);

	const fileContent = `/**
 * Disposable/Temporary Email Domains Database
 * Auto-generated on ${timestamp}
 *
 * Sources:
 * - FakeFilter (https://github.com/7c/fakefilter) - ${fakeFilter.domains.size} domains
 * - disposable-email-domains (https://github.com/disposable-email-domains/disposable-email-domains) - ${disposableEmailDomains.size} domains
 * - disposable (https://github.com/disposable/disposable-email-domains) - ${disposable.size} domains
 *
 * Total unique domains: ${allDomains.size}
 *
 * To regenerate: npx tsx scripts/generate-disposable-domains.ts
 */

/**
 * Known disposable email providers with friendly names
 */
export const KNOWN_DISPOSABLE_PROVIDERS: Map<string, string> = new Map([
${providerMapContent}
]);

/**
 * All known disposable email domains
 */
export const DISPOSABLE_DOMAINS: Set<string> = new Set([
${sortedDomains.map((d) => `  "${d}"`).join(",\n")}
]);

/**
 * Check if a domain is a known disposable email domain
 */
export function isDisposableDomain(domain: string): boolean {
  return DISPOSABLE_DOMAINS.has(domain.toLowerCase());
}

/**
 * Get provider name for a disposable domain (if known)
 */
export function getDisposableProvider(domain: string): string | undefined {
  return KNOWN_DISPOSABLE_PROVIDERS.get(domain.toLowerCase());
}

/**
 * Get the total count of disposable domains
 */
export function getDisposableDomainCount(): number {
  return DISPOSABLE_DOMAINS.size;
}
`;

	// Write to file
	const outputPath = join(PACKAGE_ROOT, "src", "data", "disposable-domains.ts");
	writeFileSync(outputPath, fileContent, "utf-8");

	console.log(`\n✅ Generated ${outputPath}`);
	console.log(`   Total domains: ${allDomains.size}`);
	console.log(`   Known providers: ${fakeFilter.providers.size}`);
}

main().catch(console.error);
