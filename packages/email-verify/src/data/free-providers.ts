/**
 * Free Email Provider Database
 * These are legitimate free email services
 */

export const FREE_EMAIL_PROVIDERS: Map<string, string> = new Map([
  // Google
  ["gmail.com", "Gmail"],
  ["googlemail.com", "Gmail"],

  // Microsoft
  ["outlook.com", "Outlook"],
  ["outlook.co.uk", "Outlook"],
  ["outlook.de", "Outlook"],
  ["outlook.fr", "Outlook"],
  ["outlook.es", "Outlook"],
  ["outlook.it", "Outlook"],
  ["outlook.jp", "Outlook"],
  ["outlook.com.br", "Outlook"],
  ["hotmail.com", "Hotmail"],
  ["hotmail.co.uk", "Hotmail"],
  ["hotmail.de", "Hotmail"],
  ["hotmail.fr", "Hotmail"],
  ["hotmail.es", "Hotmail"],
  ["hotmail.it", "Hotmail"],
  ["hotmail.co.jp", "Hotmail"],
  ["hotmail.com.br", "Hotmail"],
  ["live.com", "Live"],
  ["live.co.uk", "Live"],
  ["live.de", "Live"],
  ["live.fr", "Live"],
  ["msn.com", "MSN"],

  // Yahoo
  ["yahoo.com", "Yahoo"],
  ["yahoo.co.uk", "Yahoo"],
  ["yahoo.de", "Yahoo"],
  ["yahoo.fr", "Yahoo"],
  ["yahoo.es", "Yahoo"],
  ["yahoo.it", "Yahoo"],
  ["yahoo.co.jp", "Yahoo"],
  ["yahoo.com.br", "Yahoo"],
  ["yahoo.ca", "Yahoo"],
  ["yahoo.com.au", "Yahoo"],
  ["yahoo.co.in", "Yahoo"],
  ["ymail.com", "Yahoo"],
  ["rocketmail.com", "Yahoo"],

  // Apple
  ["icloud.com", "iCloud"],
  ["me.com", "iCloud"],
  ["mac.com", "iCloud"],

  // AOL
  ["aol.com", "AOL"],
  ["aol.co.uk", "AOL"],
  ["aol.de", "AOL"],
  ["aol.fr", "AOL"],
  ["aim.com", "AIM"],

  // ProtonMail
  ["protonmail.com", "ProtonMail"],
  ["protonmail.ch", "ProtonMail"],
  ["proton.me", "ProtonMail"],
  ["pm.me", "ProtonMail"],

  // Zoho
  ["zoho.com", "Zoho"],
  ["zohomail.com", "Zoho"],
  ["zohomail.in", "Zoho"],

  // GMX
  ["gmx.com", "GMX"],
  ["gmx.de", "GMX"],
  ["gmx.net", "GMX"],
  ["gmx.at", "GMX"],
  ["gmx.ch", "GMX"],

  // Mail.com
  ["mail.com", "Mail.com"],
  ["email.com", "Mail.com"],
  ["usa.com", "Mail.com"],
  ["myself.com", "Mail.com"],
  ["consultant.com", "Mail.com"],
  ["post.com", "Mail.com"],
  ["europe.com", "Mail.com"],
  ["asia.com", "Mail.com"],
  ["iname.com", "Mail.com"],
  ["writeme.com", "Mail.com"],
  ["dr.com", "Mail.com"],
  ["cheerful.com", "Mail.com"],
  ["accountant.com", "Mail.com"],

  // Yandex
  ["yandex.com", "Yandex"],
  ["yandex.ru", "Yandex"],
  ["ya.ru", "Yandex"],

  // Mail.ru
  ["mail.ru", "Mail.ru"],
  ["inbox.ru", "Mail.ru"],
  ["bk.ru", "Mail.ru"],
  ["list.ru", "Mail.ru"],

  // Tutanota
  ["tutanota.com", "Tutanota"],
  ["tutanota.de", "Tutanota"],
  ["tutamail.com", "Tutanota"],
  ["tuta.io", "Tutanota"],

  // FastMail
  ["fastmail.com", "FastMail"],
  ["fastmail.fm", "FastMail"],

  // Other Popular Free Providers
  ["rediffmail.com", "Rediffmail"],
  ["inbox.com", "Inbox.com"],
  ["hushmail.com", "Hushmail"],
  ["runbox.com", "Runbox"],
  ["mailfence.com", "Mailfence"],
  ["disroot.org", "Disroot"],
  ["startmail.com", "StartMail"],
  ["cock.li", "Cock.li"],
  ["airmail.cc", "Airmail"],
  ["openmailbox.org", "OpenMailbox"],

  // Regional Free Providers
  ["web.de", "Web.de"],
  ["freenet.de", "Freenet"],
  ["t-online.de", "T-Online"],
  ["orange.fr", "Orange"],
  ["free.fr", "Free.fr"],
  ["laposte.net", "La Poste"],
  ["wanadoo.fr", "Wanadoo"],
  ["libero.it", "Libero"],
  ["virgilio.it", "Virgilio"],
  ["alice.it", "Alice"],
  ["tiscali.it", "Tiscali"],
  ["terra.com.br", "Terra"],
  ["uol.com.br", "UOL"],
  ["bol.com.br", "BOL"],
  ["ig.com.br", "IG"],
  ["qq.com", "QQ"],
  ["163.com", "163.com"],
  ["126.com", "126.com"],
  ["sina.com", "Sina"],
  ["sohu.com", "Sohu"],
  ["naver.com", "Naver"],
  ["daum.net", "Daum"],
  ["hanmail.net", "Hanmail"],

  // ISP-based Free Email
  ["att.net", "AT&T"],
  ["sbcglobal.net", "SBC Global"],
  ["bellsouth.net", "BellSouth"],
  ["comcast.net", "Comcast"],
  ["verizon.net", "Verizon"],
  ["cox.net", "Cox"],
  ["charter.net", "Charter"],
  ["earthlink.net", "EarthLink"],
  ["juno.com", "Juno"],
  ["netzero.net", "NetZero"],

  // Educational (common free services)
  ["edu", "Educational"],
]);

/**
 * Check if a domain is a free email provider
 */
export function isFreeProvider(domain: string): boolean {
  return FREE_EMAIL_PROVIDERS.has(domain.toLowerCase());
}

/**
 * Get the provider name for a free email domain
 */
export function getFreeProviderName(domain: string): string | undefined {
  return FREE_EMAIL_PROVIDERS.get(domain.toLowerCase());
}

/**
 * Get the count of free providers in database
 */
export function getFreeProviderCount(): number {
  return FREE_EMAIL_PROVIDERS.size;
}
