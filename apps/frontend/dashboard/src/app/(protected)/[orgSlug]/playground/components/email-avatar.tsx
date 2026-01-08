"use client";

import { Skeleton } from "@verifio/ui/skeleton";
import { useEffect, useState } from "react";

interface EmailAvatarProps {
	email: string;
	className?: string;
}

// Generate a consistent color based on the first letter
const letterColors: Record<string, string> = {
	a: "bg-red-500",
	b: "bg-orange-500",
	c: "bg-amber-500",
	d: "bg-yellow-500",
	e: "bg-lime-500",
	f: "bg-green-500",
	g: "bg-emerald-500",
	h: "bg-teal-500",
	i: "bg-cyan-500",
	j: "bg-sky-500",
	k: "bg-blue-500",
	l: "bg-indigo-500",
	m: "bg-violet-500",
	n: "bg-purple-500",
	o: "bg-fuchsia-500",
	p: "bg-pink-500",
	q: "bg-rose-500",
	r: "bg-red-600",
	s: "bg-orange-600",
	t: "bg-amber-600",
	u: "bg-yellow-600",
	v: "bg-lime-600",
	w: "bg-green-600",
	x: "bg-emerald-600",
	y: "bg-teal-600",
	z: "bg-cyan-600",
};

const getColorForLetter = (letter: string): string => {
	const lowerLetter = letter.toLowerCase();
	return letterColors[lowerLetter] || "bg-primary-base";
};

// Generate MD5 hash for Gravatar
const md5 = async (str: string): Promise<string> => {
	const encoder = new TextEncoder();
	const data = encoder.encode(str.toLowerCase().trim());
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

/**
 * Component that displays user avatar based on email.
 * Tries to load Gravatar first, falls back to a colored circle with first letter.
 */
export const EmailAvatar = ({
	email,
	className = "h-6 w-6",
}: EmailAvatarProps) => {
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
	const [avatarLoaded, setAvatarLoaded] = useState(false);
	const [avatarFailed, setAvatarFailed] = useState(false);

	const firstLetter = email.charAt(0).toUpperCase();
	const bgColor = getColorForLetter(firstLetter);

	useEffect(() => {
		const generateGravatarUrl = async () => {
			const hash = await md5(email);
			// d=404 returns 404 if no avatar exists
			setAvatarUrl(`https://www.gravatar.com/avatar/${hash}?d=404&s=64`);
		};
		generateGravatarUrl();
	}, [email]);

	// Show letter fallback if avatar failed or no URL yet
	if (avatarFailed || !avatarUrl) {
		return (
			<div
				className={`${className} flex items-center justify-center rounded-full ${bgColor} font-semibold text-white text-xs`}
			>
				{firstLetter}
			</div>
		);
	}

	return (
		<>
			{!avatarLoaded && <Skeleton className={`${className} rounded-full`} />}
			<img
				src={avatarUrl}
				alt={`${email} avatar`}
				className={`${className} ${avatarLoaded ? "block" : "hidden"} rounded-full`}
				onLoad={() => setAvatarLoaded(true)}
				onError={() => setAvatarFailed(true)}
			/>
		</>
	);
};
