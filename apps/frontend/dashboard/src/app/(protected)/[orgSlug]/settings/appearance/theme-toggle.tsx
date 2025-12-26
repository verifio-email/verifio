"use client";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import { useTheme } from "next-themes";
import { SidebarLayoutIcon } from "./sidebar-layout-icon";

export function ThemeToggleAppearance() {
	const { theme, setTheme } = useTheme();
	const themeOptions = [
		{
			value: "light",
			label: "Light",
			icon: "sun",
			image: "/dashboard/ui-light.png",
			layoutIcon: <SidebarLayoutIcon variant="light" />,
		},
		{
			value: "dark",
			label: "Dark",
			icon: "moon",
			image: "/dashboard/ui-dark.png",
			layoutIcon: <SidebarLayoutIcon variant="dark" />,
		},
		{
			value: "system",
			label: "System",
			icon: "monitor",
			image: "/dashboard/ui-system.png",
			layoutIcon: <SidebarLayoutIcon variant="auto" />,
		},
	];

	return (
		<div className="flex">
			{themeOptions.map((option, index) => (
				<div
					key={option.value}
					className="flex border-stroke-soft-200/50 border-r"
				>
					<button
						type="button"
						onClick={() => setTheme(option.value)}
						className={cn(
							"relative transition-all duration-200",
							theme === option.value ? "bg-primary-alpha-10" : "",
						)}
					>
						{/* Checkmark indicator */}
						{theme === option.value && (
							<div className="absolute top-3 right-5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-base">
								<Icon name="check" className="h-3 w-3 text-white" />
							</div>
						)}
						<div className="px-6 py-4">{option.layoutIcon}</div>
						<div className="flex items-center justify-center gap-2 border-stroke-soft-200/50 border-t py-3">
							<Icon
								name={option.icon}
								className={cn(
									"h-4 w-4",
									theme === option.value
										? "text-primary-600"
										: "text-text-sub-600",
								)}
							/>
							<p
								className={cn(
									"font-medium text-sm",
									theme === option.value
										? "text-primary-600"
										: "text-text-sub-600",
								)}
							>
								{option.label}
							</p>
						</div>
					</button>
				</div>
			))}
		</div>
	);
}
