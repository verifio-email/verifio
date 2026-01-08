"use client";

import { getProviderIcon } from "@fe/dashboard/utils/email-provider-icon";
import { Icon } from "@verifio/ui/icon";
import { Skeleton } from "@verifio/ui/skeleton";
import { useState } from "react";

interface EmailProviderIconProps {
	email: string;
	iconClassName?: string;
	imgClassName?: string;
}

/**
 * Component that displays email provider icon.
 * Tries to load the domain's favicon first (without www, then with www),
 * and finally falls back to a generic mail icon.
 */
export const EmailProviderIcon = ({
	email,
	iconClassName = "h-4 w-4",
	imgClassName = "h-4 w-4",
}: EmailProviderIconProps) => {
	const [faviconLoaded, setFaviconLoaded] = useState(false);
	const [tryWww, setTryWww] = useState(false);
	const [faviconFailed, setFaviconFailed] = useState(false);

	// Extract domain from email
	const domain = email.split("@")[1]?.toLowerCase();

	// Check if we have a known provider icon
	const ProviderIcon = getProviderIcon(email);

	// If we have a known provider icon, use it directly (e.g., Gmail, Outlook)
	if (ProviderIcon) {
		return <ProviderIcon className={iconClassName} />;
	}

	// If both URLs failed, show fallback
	if (faviconFailed || !domain) {
		return (
			<Icon
				name="mail-single"
				className={`${iconClassName} text-text-sub-600`}
			/>
		);
	}

	const faviconUrl = tryWww
		? `https://www.${domain}/favicon.ico`
		: `https://${domain}/favicon.ico`;

	const handleError = () => {
		if (!tryWww) {
			setTryWww(true);
		} else {
			setFaviconFailed(true);
		}
	};

	return (
		<>
			{!faviconLoaded && (
				<Skeleton className={`${imgClassName} rounded-full`} />
			)}
			<img
				src={faviconUrl}
				alt={`${domain} icon`}
				className={`${imgClassName} ${faviconLoaded ? "block" : "hidden"} rounded-full`}
				onLoad={() => setFaviconLoaded(true)}
				onError={handleError}
			/>
		</>
	);
};
