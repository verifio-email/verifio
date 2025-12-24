"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="flex h-8 w-20 items-center justify-center rounded-full border border-stroke-soft-100 px-3 py-1.5">
				<div className="size-4 animate-pulse rounded-full bg-stroke-soft-100" />
			</div>
		);
	}

	const isDark = theme === "dark";

	return (
		<button
			type="button"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="flex items-center gap-2 rounded-full border border-stroke-soft-100 px-3 py-1.5 text-xs text-text-sub-600 transition-colors hover:bg-bg-weak-50 hover:text-text-strong-950 md:text-sm"
			aria-label="Toggle theme"
		>
			<span className="relative flex size-4 items-center justify-center">
				<AnimatePresence mode="wait">
					{isDark ? (
						<motion.svg
							key="sun"
							initial={{ rotate: -90, scale: 0, opacity: 0 }}
							animate={{ rotate: 0, scale: 1, opacity: 1 }}
							exit={{ rotate: 90, scale: 0, opacity: 0 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className="absolute size-4"
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
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
						</motion.svg>
					) : (
						<motion.svg
							key="moon"
							initial={{ rotate: 90, scale: 0, opacity: 0 }}
							animate={{ rotate: 0, scale: 1, opacity: 1 }}
							exit={{ rotate: -90, scale: 0, opacity: 0 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className="absolute size-4"
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
						</motion.svg>
					)}
				</AnimatePresence>
			</span>
			<AnimatePresence mode="wait">
				<motion.span
					key={isDark ? "light" : "dark"}
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -10, opacity: 0 }}
					transition={{ duration: 0.2 }}
				>
					{isDark ? "Light" : "Dark"}
				</motion.span>
			</AnimatePresence>
		</button>
	);
};
