"use client";

import { useState } from "react";

interface DomainFaviconProps {
	domain: string;
	size?: number;
	className?: string;
}

// Generate a consistent color based on the domain string
const getColorFromDomain = (domain: string): string => {
	const colors = [
		"bg-red-500",
		"bg-orange-500",
		"bg-amber-500",
		"bg-yellow-500",
		"bg-lime-500",
		"bg-green-500",
		"bg-emerald-500",
		"bg-teal-500",
		"bg-cyan-500",
		"bg-sky-500",
		"bg-blue-500",
		"bg-indigo-500",
		"bg-violet-500",
		"bg-purple-500",
		"bg-fuchsia-500",
		"bg-pink-500",
		"bg-rose-500",
	];

	let hash = 0;
	for (let i = 0; i < domain.length; i++) {
		hash = domain.charCodeAt(i) + ((hash << 5) - hash);
	}

	return colors[Math.abs(hash) % colors.length] || "bg-gray-500";
};

export const DomainFavicon = ({
	domain,
	size = 32,
	className = "",
}: DomainFaviconProps) => {
	const [hasError, setHasError] = useState(false);

	const firstLetter = domain.charAt(0).toUpperCase();
	const bgColor = getColorFromDomain(domain);

	if (hasError) {
		return (
			<div
				className={`flex items-center justify-center rounded font-semibold text-white ${bgColor} ${className}`}
				style={{ width: size, height: size, fontSize: size * 0.5 }}
			>
				{firstLetter}
			</div>
		);
	}

	return (
		<img
			src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
			alt={`${domain} favicon`}
			className={`rounded ${className}`}
			style={{ width: size, height: size }}
			onError={() => setHasError(true)}
		/>
	);
};
