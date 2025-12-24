export interface MainNavigationItem {
	label: string;
	path: string;
	iconName: string;
	variant?: "default" | "danger";
	action?: "signout";
	hasSeparatorAbove?: boolean;
	isExternal?: boolean;
}

export const mainNavigation: MainNavigationItem[] = [
	{
		label: "Overview",
		path: "/",
		iconName: "house",
	},
	{
		label: "API Keys",
		path: "/api-keys",
		iconName: "key-new",
	},
	{
		label: "Logs",
		path: "/logs",
		iconName: "file-text",
	},
	{
		label: "Domain",
		path: "/domain",
		iconName: "globe",
	},
	{
		label: "Webhooks",
		path: "/webhooks",
		iconName: "webhook",
	},
	{
		label: "Settings",
		path: "/settings",
		iconName: "gear",
	},
];

export const userNavigation: MainNavigationItem[] = [
	{
		label: "Documentation",
		path: "https://docs.verifio.dev",
		iconName: "info-outline",
		isExternal: true,
	},
	{
		label: "Account Settings",
		path: "/settings",
		iconName: "user",
		hasSeparatorAbove: true,
	},
	{
		label: "Team Settings",
		path: "/settings/team",
		iconName: "gear",
		hasSeparatorAbove: true,
	},
	{
		label: "Sign out",
		path: "",
		iconName: "arrow-right-rec",
		variant: "danger",
		action: "signout",
		hasSeparatorAbove: true,
	},
];
