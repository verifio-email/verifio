"use client";

import { getProviderIcon } from "@fe/dashboard/utils/email-provider-icon";
import { Icon } from "@verifio/ui/icon";
import { useState } from "react";

interface EmailProviderIconProps {
	email: string;
	iconClassName?: string;
	imgClassName?: string;
}

/**
 * Component that displays email provider icon.
 * Tries to load the domain's favicon first, falls back to known provider icons,
 * and finally falls back to a generic mail icon.
 */
export const EmailProviderIcon = ({
	email,
	iconClassName = "h-4 w-4",
	imgClassName = "h-4 w-4",
}: EmailProviderIconProps) => {
	const [faviconLoaded, setFaviconLoaded] = useState(false);
	const [faviconFailed, setFaviconFailed] = useState(false);

	// Extract domain from email
	const domain = email.split("@")[1]?.toLowerCase();

	// Check if we have a known provider icon
	const ProviderIcon = getProviderIcon(email);

	// If we have a known provider icon, use it directly (e.g., Gmail, Outlook)
	if (ProviderIcon) {
		return <ProviderIcon className={iconClassName} />;
	}

	// If favicon has failed, show fallback immediately
	if (faviconFailed || !domain) {
		return (
			<Icon
				name="mail-single"
				className={`${iconClassName} text-text-sub-600`}
			/>
		);
	}

	// Use Google's favicon service for better reliability
	const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

	return (
		<>
			{/* Loading spinner while favicon loads */}
			{!faviconLoaded && (
				<Icon
					name="loader"
					className={`${iconClassName} animate-spin text-text-soft-400`}
				/>
			)}
			{/* Favicon image - hidden until loaded */}
			<img
				src={faviconUrl}
				alt={`${domain} icon`}
				className={`${imgClassName} ${faviconLoaded ? "block" : "hidden"} rounded-full`}
				onLoad={() => setFaviconLoaded(true)}
				onError={() => setFaviconFailed(true)}
			/>
		</>
	);
};
