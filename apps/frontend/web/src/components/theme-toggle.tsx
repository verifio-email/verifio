/** biome-ignore-all lint/a11y/useSemanticElements: <explanation> */
"use client";

import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themes = ["light", "dark", "system"] as const;
type ThemeOption = (typeof themes)[number];

const themeIconMap: Record<ThemeOption, string> = {
	system: "laptop",
	light: "sun",
	dark: "moon",
};

export const ThemeToggle = () => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="flex h-8 w-[104px] items-center justify-center rounded-full border border-stroke-soft-200/60">
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
			<motion.div
				className="pointer-events-none absolute left-1 h-6 w-8 rounded-full border border-stroke-soft-200/60 bg-bg-white-0"
				initial={false}
				animate={{ x: activeIndex * 32 }}
				transition={{ type: "spring", stiffness: 300, damping: 30 }}
			/>

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
					<Icon
						name={themeIconMap[themeOption]}
						className={`size-4 transition-colors ${currentTheme === themeOption ? "text-text-strong-950" : "text-text-soft-400"}`}
					/>
				</button>
			))}
		</div>
	);
};
