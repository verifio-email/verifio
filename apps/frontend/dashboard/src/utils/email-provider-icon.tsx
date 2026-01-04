import {
	AOL,
	ATandT,
	apple,
	comcast,
	fastMail,
	GMX,
	gmail,
	mailru,
	naver,
	orange,
	outlook,
	protonMail,
	QQ,
	rediffmail,
	tutanota,
	UOL,
	verizon,
	yahoo,
	yandex,
	zoho,
} from "@verifio/email-verify/utils/email-icons";
import type { ComponentType, SVGProps } from "react";

// Map domains to their icon components
const providerIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
	// Gmail
	"gmail.com": gmail,
	"googlemail.com": gmail,

	// Microsoft
	"outlook.com": outlook,
	"outlook.co.uk": outlook,
	"outlook.de": outlook,
	"outlook.fr": outlook,
	"outlook.es": outlook,
	"outlook.it": outlook,
	"outlook.jp": outlook,
	"outlook.com.br": outlook,
	"hotmail.com": outlook,
	"hotmail.co.uk": outlook,
	"hotmail.de": outlook,
	"hotmail.fr": outlook,
	"hotmail.es": outlook,
	"hotmail.it": outlook,
	"hotmail.co.jp": outlook,
	"hotmail.com.br": outlook,
	"live.com": outlook,
	"live.co.uk": outlook,
	"live.de": outlook,
	"live.fr": outlook,
	"msn.com": outlook,

	// Yahoo
	"yahoo.com": yahoo,
	"yahoo.co.uk": yahoo,
	"yahoo.de": yahoo,
	"yahoo.fr": yahoo,
	"yahoo.es": yahoo,
	"yahoo.it": yahoo,
	"yahoo.co.jp": yahoo,
	"yahoo.com.br": yahoo,
	"yahoo.ca": yahoo,
	"yahoo.com.au": yahoo,
	"yahoo.co.in": yahoo,
	"ymail.com": yahoo,
	"rocketmail.com": yahoo,

	// Apple
	"icloud.com": apple,
	"me.com": apple,
	"mac.com": apple,

	// AOL
	"aol.com": AOL,
	"aol.co.uk": AOL,
	"aol.de": AOL,
	"aol.fr": AOL,
	"aim.com": AOL,

	// ProtonMail
	"protonmail.com": protonMail,
	"protonmail.ch": protonMail,
	"proton.me": protonMail,
	"pm.me": protonMail,

	// Zoho
	"zoho.com": zoho,
	"zohomail.com": zoho,
	"zohomail.in": zoho,

	// GMX
	"gmx.com": GMX,
	"gmx.de": GMX,
	"gmx.net": GMX,
	"gmx.at": GMX,
	"gmx.ch": GMX,

	// Yandex
	"yandex.com": yandex,
	"yandex.ru": yandex,
	"ya.ru": yandex,

	// Mail.ru
	"mail.ru": mailru,
	"inbox.ru": mailru,
	"bk.ru": mailru,
	"list.ru": mailru,

	// Tutanota
	"tutanota.com": tutanota,
	"tutanota.de": tutanota,
	"tutamail.com": tutanota,
	"tuta.io": tutanota,

	// FastMail
	"fastmail.com": fastMail,
	"fastmail.fm": fastMail,

	// QQ
	"qq.com": QQ,

	// Naver
	"naver.com": naver,

	// Orange
	"orange.fr": orange,

	// Rediffmail
	"rediffmail.com": rediffmail,

	// UOL
	"uol.com.br": UOL,

	// AT&T
	"att.net": ATandT,
	"sbcglobal.net": ATandT,

	// Comcast
	"comcast.net": comcast,

	// Verizon
	"verizon.net": verizon,
};

/**
 * Get the email domain from an email address
 */
function getEmailDomain(email: string): string | null {
	const atIndex = email.lastIndexOf("@");
	if (atIndex === -1) return null;
	return email.slice(atIndex + 1).toLowerCase();
}

/**
 * Get the provider icon component for an email address
 * Returns null if no matching provider icon is found
 */
export function getProviderIcon(
	email: string,
): ComponentType<SVGProps<SVGSVGElement>> | null {
	const domain = getEmailDomain(email);
	if (!domain) return null;
	return providerIcons[domain] || null;
}

/**
 * Check if an email has a known provider icon
 */
export function hasProviderIcon(email: string): boolean {
	return getProviderIcon(email) !== null;
}
