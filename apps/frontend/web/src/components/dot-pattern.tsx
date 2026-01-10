"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface DotPatternProps {
	className?: string;
	/** Dot size in pixels */
	dotSize?: number;
	/** Grid spacing in pixels */
	spacing?: number;
	/** Opacity of the dots (0-1) */
	opacity?: number;
}

export function DotPattern({
	className = "",
	dotSize = 1,
	spacing = 20,
	opacity = 0.08,
}: DotPatternProps) {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Prevent hydration mismatch by not rendering until mounted
	if (!mounted) {
		return <div className={`${className}`} />;
	}

	const dotColor =
		resolvedTheme === "dark"
			? `rgba(255, 255, 255, ${opacity})`
			: `rgba(0, 0, 0, ${opacity})`;

	return (
		<div
			className={className}
			style={{
				backgroundImage: `radial-gradient(circle at ${dotSize}px ${dotSize}px, ${dotColor} ${dotSize}px, transparent 0)`,
				backgroundSize: `${spacing}px ${spacing}px`,
			}}
		/>
	);
}

export default DotPattern;
