"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themes = ["system", "light", "dark"] as const;
type ThemeOption = (typeof themes)[number];

export const ThemeToggle = () => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="flex h-8 w-[104px] items-center justify-center rounded-full border border-stroke-soft-100 bg-bg-weak-50">
				<div className="size-4 animate-pulse rounded-full bg-stroke-soft-100" />
			</div>
		);
	}

	const currentTheme = (theme as ThemeOption) || "system";
	const activeIndex = themes.indexOf(currentTheme);

	return (
		<div
			className="relative flex h-8 items-center gap-0 rounded-full border border-stroke-soft-200/60 p-1"
			role="radiogroup"
			aria-label="Select theme"
		>
			{/* Sliding background indicator */}
			<motion.div
				className="pointer-events-none absolute left-1 h-6 w-8 rounded-full border border-stroke-soft-200/60 bg-bg-white-0"
				initial={false}
				animate={{
					x: activeIndex * 32,
				}}
				transition={{
					type: "spring",
					stiffness: 300,
					damping: 30,
				}}
			/>

			{/* Theme buttons */}
			{themes.map((themeOption) => (
				<button
					key={themeOption}
					type="button"
					role="radio"
					aria-checked={currentTheme === themeOption}
					onClick={() => setTheme(themeOption)}
					className="relative z-10 flex h-6 w-8 items-center justify-center rounded-full transition-colors"
					aria-label={`${themeOption.charAt(0).toUpperCase() + themeOption.slice(1)} theme`}
				>
					{themeOption === "system" && (
						<svg
							className={`size-4 transition-colors ${currentTheme === "system" ? "text-text-strong-950" : "text-text-soft-400"}`}
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
							<path d="M12 18h.01" />
						</svg>
					)}
					{themeOption === "light" && (
						<svg
							className={`size-4 transition-colors ${currentTheme === "light" ? "text-text-strong-950" : "text-text-soft-400"}`}
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="12" cy="12" r="4" />
							<path d="M12 2v2" />
							<path d="M12 20v2" />
							<path d="m4.93 4.93 1.41 1.41" />
							<path d="m17.66 17.66 1.41 1.41" />
							<path d="M2 12h2" />
							<path d="M20 12h2" />
							<path d="m6.34 17.66-1.41 1.41" />
							<path d="m19.07 4.93-1.41 1.41" />
						</svg>
					)}
					{themeOption === "dark" && (
						<svg
							className={`size-4 transition-colors ${currentTheme === "dark" ? "text-text-strong-950" : "text-text-soft-400"}`}
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
						</svg>
					)}
				</button>
			))}
		</div>
	);
};
