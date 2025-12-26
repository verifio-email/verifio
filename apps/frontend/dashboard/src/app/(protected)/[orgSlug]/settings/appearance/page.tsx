"use client";

import { ThemeToggleAppearance } from "./theme-toggle";

const AppearancePage = () => {
	return (
		<div className="flex h-full flex-col">
			{/* Theme Section */}
			<div className="relative">
				<div className="px-5 pt-5 pb-4 lg:px-6">
					<h3 className="font-medium text-label-md text-text-strong-950">
						Theme
					</h3>
					<p className="text-paragraph-sm text-text-sub-600">
						Select a theme to personalize your platform's appearance
					</p>
				</div>
				{/* Horizontal line below header - extends to right edge */}
				<div className="relative">
					<div className="absolute right-[-100vw] left-0 h-px bg-stroke-soft-200/50" />
				</div>
				<ThemeToggleAppearance />
				{/* Bottom border extending to right edge */}
				<div className="absolute right-[-100vw] bottom-0 left-0 h-px bg-stroke-soft-200/50" />
			</div>

			{/* Bottom spacer */}
			<div className="flex-1" />
		</div>
	);
};

export default AppearancePage;
