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
		label: "Playground",
		path: "/playground",
		iconName: "play",
	},
	{
		label: "Bulk",
		path: "/bulk",
		iconName: "layers",
	},
	{
		label: "Logs",
		path: "/logs",
		iconName: "file-text",
	},
	{
		label: "Usage",
		path: "/usage",
		iconName: "chart-column",
	},
	{
		label: "API Keys",
		path: "/api-keys",
		iconName: "key-new",
	},
	{
		label: "Settings",
		path: "/settings",
		iconName: "gear",
	},
];

export const userNavigation: MainNavigationItem[] = [
	{
		label: "Blog",
		path: "https://blog.verifio.dev",
		iconName: "external-link",
		isExternal: true,
	},
	{
		label: "Documentation",
		path: "https://docs.verifio.dev",
		iconName: "help-circle",
		isExternal: true,
	},
	{
		label: "Join Discord community",
		path: "https://discord.gg/verifio",
		iconName: "users",
		isExternal: true,
	},
	{
		label: "Github",
		path: "https://github.com/verifio",
		iconName: "github",
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
	},
	{
		label: "Manage Subscriptions",
		path: "/settings/billing",
		iconName: "credit-card",
	},
	{
		label: "Sign out",
		path: "",
		iconName: "log-out",
		variant: "danger",
		action: "signout",
		hasSeparatorAbove: true,
	},
];
