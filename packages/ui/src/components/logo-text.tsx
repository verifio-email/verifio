"use client";

export const LogoText = ({ className }: { className?: string }) => {
	return (
		<svg
			className={className}
			viewBox="0 0 80 22"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<text
				x="0"
				y="17"
				fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
				fontSize="18"
				fontWeight="600"
				fill="#2F384C"
			>
				Verifio
			</text>
		</svg>
	);
};
