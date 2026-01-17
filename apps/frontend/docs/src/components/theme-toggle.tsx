"use client";

import { Icon } from "@verifio/ui/icon";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themes = ["light", "dark", "system"] as const;
type ThemeOption = (typeof themes)[number];

const themeIconMap: Record<ThemeOption, string> = {
	light: "sun",
	dark: "moon",
	system: "laptop",
};

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const cycleTheme = () => {
		const currentTheme = (theme ?? "system") as ThemeOption;
		const currentIndex = themes.indexOf(currentTheme);
		const nextIndex = (currentIndex + 1) % themes.length;
		const nextTheme = themes[nextIndex] as ThemeOption;
		setTheme(nextTheme);
	};

	// Prevent hydration mismatch
	if (!mounted) {
		return (
			<button
				type="button"
				className="inline-flex size-8 items-center justify-center rounded-md text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground"
				aria-label="Toggle theme"
			>
				<span className="size-4.5" />
			</button>
		);
	}

	const currentTheme = (theme ?? "system") as ThemeOption;

	return (
		<button
			type="button"
			onClick={cycleTheme}
			className="inline-flex size-8 items-center justify-center rounded-md text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground"
			aria-label={`Current theme: ${currentTheme}. Click to switch.`}
		>
			<Icon name={themeIconMap[currentTheme]} className="size-4.5" />
		</button>
	);
}
