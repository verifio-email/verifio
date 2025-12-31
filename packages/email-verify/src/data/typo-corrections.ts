/**
 * Common Domain Typos Database
 * Maps common typos to their correct domains
 */

export const DOMAIN_TYPOS: Map<string, string> = new Map([
  // Gmail typos
  ["gmai.com", "gmail.com"],
  ["gmial.com", "gmail.com"],
  ["gmeil.com", "gmail.com"],
  ["gmal.com", "gmail.com"],
  ["gmall.com", "gmail.com"],
  ["gmaill.com", "gmail.com"],
  ["gamil.com", "gmail.com"],
  ["gnail.com", "gmail.com"],
  ["gmsil.com", "gmail.com"],
  ["gmil.com", "gmail.com"],
  ["gmaul.com", "gmail.com"],
  ["gmaio.com", "gmail.com"],
  ["gmaik.com", "gmail.com"],
  ["gmailc.om", "gmail.com"],
  ["gmail.co", "gmail.com"],
  ["gmail.con", "gmail.com"],
  ["gmail.om", "gmail.com"],
  ["gmail.cm", "gmail.com"],
  ["gmail.cmo", "gmail.com"],
  ["gmail.comm", "gmail.com"],
  ["gmail.vom", "gmail.com"],
  ["gmail.xom", "gmail.com"],
  ["gmail.dom", "gmail.com"],
  ["gmaill.com", "gmail.com"],
  ["ggmail.com", "gmail.com"],
  ["gemail.com", "gmail.com"],
  ["g]mail.com", "gmail.com"],
  ["hmail.com", "gmail.com"],
  ["gimail.com", "gmail.com"],
  ["gmailcom", "gmail.com"],

  // Yahoo typos
  ["yaho.com", "yahoo.com"],
  ["yahooo.com", "yahoo.com"],
  ["yaoo.com", "yahoo.com"],
  ["yahho.com", "yahoo.com"],
  ["yhaoo.com", "yahoo.com"],
  ["yhoo.com", "yahoo.com"],
  ["tahoo.com", "yahoo.com"],
  ["uahoo.com", "yahoo.com"],
  ["gahoo.com", "yahoo.com"],
  ["yahoo.co", "yahoo.com"],
  ["yahoo.con", "yahoo.com"],
  ["yahoo.om", "yahoo.com"],
  ["yahoo.cm", "yahoo.com"],
  ["yahoo.cmo", "yahoo.com"],
  ["yahoo.vom", "yahoo.com"],
  ["ymail.co", "ymail.com"],
  ["ymail.con", "ymail.com"],

  // Hotmail typos
  ["hotmai.com", "hotmail.com"],
  ["hotmal.com", "hotmail.com"],
  ["hotmial.com", "hotmail.com"],
  ["hotmil.com", "hotmail.com"],
  ["hotamil.com", "hotmail.com"],
  ["homail.com", "hotmail.com"],
  ["htmail.com", "hotmail.com"],
  ["hotmail.co", "hotmail.com"],
  ["hotmail.con", "hotmail.com"],
  ["hotmail.om", "hotmail.com"],
  ["hotmail.cm", "hotmail.com"],
  ["hotmail.cmo", "hotmail.com"],
  ["hotmail.vom", "hotmail.com"],
  ["hotmailcom", "hotmail.com"],
  ["hotmailc.om", "hotmail.com"],
  ["hotamil.con", "hotmail.com"],
  ["hptmail.com", "hotmail.com"],

  // Outlook typos
  ["outlok.com", "outlook.com"],
  ["outloo.com", "outlook.com"],
  ["outlool.com", "outlook.com"],
  ["outllok.com", "outlook.com"],
  ["outloook.com", "outlook.com"],
  ["otlook.com", "outlook.com"],
  ["outlook.co", "outlook.com"],
  ["outlook.con", "outlook.com"],
  ["outlook.om", "outlook.com"],
  ["outlook.cm", "outlook.com"],
  ["outlook.vom", "outlook.com"],
  ["oitlook.com", "outlook.com"],
  ["putlook.com", "outlook.com"],

  // Live typos
  ["liv.com", "live.com"],
  ["lve.com", "live.com"],
  ["live.co", "live.com"],
  ["live.con", "live.com"],

  // iCloud typos
  ["iclod.com", "icloud.com"],
  ["icoud.com", "icloud.com"],
  ["iclould.com", "icloud.com"],
  ["icloud.co", "icloud.com"],
  ["icloud.con", "icloud.com"],
  ["icould.com", "icloud.com"],
  ["icluod.com", "icloud.com"],

  // AOL typos
  ["aol.co", "aol.com"],
  ["aol.con", "aol.com"],
  ["aol.om", "aol.com"],
  ["aol.cm", "aol.com"],
  ["aol.vom", "aol.com"],
  ["ail.com", "aol.com"],
  ["al.com", "aol.com"],

  // ProtonMail typos
  ["protonmal.com", "protonmail.com"],
  ["protonmial.com", "protonmail.com"],
  ["protonnail.com", "protonmail.com"],
  ["protonmail.co", "protonmail.com"],
  ["protonmail.con", "protonmail.com"],
  ["protonmai.com", "protonmail.com"],

  // Common TLD typos
  ["gmail.org", "gmail.com"],
  ["gmail.net", "gmail.com"],
  ["yahoo.org", "yahoo.com"],
  ["yahoo.net", "yahoo.com"],
  ["hotmail.org", "hotmail.com"],
  ["hotmail.net", "hotmail.com"],
  ["outlook.org", "outlook.com"],
  ["outlook.net", "outlook.com"],

  // .com typos (generic patterns)
  // Pattern: *.cpm -> *.com
  // Pattern: *.vom -> *.com
  // These are handled dynamically below
]);

/**
 * Common TLD typos that can be fixed generically
 */
export const TLD_TYPOS: Map<string, string> = new Map([
  ["con", "com"],
  ["cmo", "com"],
  ["cm", "com"],
  ["om", "com"],
  ["vom", "com"],
  ["xom", "com"],
  ["dom", "com"],
  ["cpm", "com"],
  ["comm", "com"],
  ["coim", "com"],
  ["co", "com"], // Be careful with this one - some legitimate domains use .co
  ["ner", "net"],
  ["ney", "net"],
  ["nte", "net"],
  ["nett", "net"],
  ["orgg", "org"],
  ["ogr", "org"],
  ["og", "org"],
]);

/**
 * Get typo suggestion for a domain
 */
export function getTypoSuggestion(domain: string): string | null {
  const lowerDomain = domain.toLowerCase();

  // Check exact match first
  if (DOMAIN_TYPOS.has(lowerDomain)) {
    return DOMAIN_TYPOS.get(lowerDomain) || null;
  }

  // Check TLD typos
  const parts = lowerDomain.split(".");
  if (parts.length >= 2) {
    const tld = parts[parts.length - 1];
    if (tld && TLD_TYPOS.has(tld)) {
      const correctedTld = TLD_TYPOS.get(tld);
      if (correctedTld) {
        parts[parts.length - 1] = correctedTld;
        return parts.join(".");
      }
    }
  }

  return null;
}

/**
 * Check if a domain has a typo
 */
export function hasTypo(domain: string): boolean {
  return getTypoSuggestion(domain) !== null;
}
