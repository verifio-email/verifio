import "@fe/docs/app/global.css";
import type { Metadata } from "next";
import Script from "next/script";
import { SidebarTabs } from "@fe/docs/components/sidebar-tabs";
import { ThemeToggle } from "@fe/docs/components/theme-toggle";
import { cn } from "@fe/docs/lib/cn";
import { source } from "@fe/docs/lib/source";
import { IconsSprite } from "@verifio/ui/icon";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import { baseOptions } from "./layout.config";

export const metadata: Metadata = {
	other: {
		"ahrefs-site-verification": "b7c3e5b12601a4c0718faa39cd851493cf35110caf5f0a8c6f9724b4968be38f",
	},
};

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<html
			lang="en"
			className={cn("touch-manipulation scroll-smooth antialiased")}
			suppressHydrationWarning
		>
			<body className="flex min-h-screen flex-col">
				<RootProvider>
					<DocsLayout
						tree={source.pageTree}
						nav={{
							...baseOptions.nav,
							mode: "top",
						}}
						githubUrl="https://github.com/verifio-email/verifio"
						tabMode="navbar"
						links={[
							{
								type: "button",
								text: "Sign In",
								url: "https://verifio.email/dashboard/login",
								secondary: true,
							},
							{
								type: "button",
								text: "Get Started",
								url: "https://verifio.email/dashboard/signup",
							},
						]}
						sidebar={{
							tabs: false,
							banner: <SidebarTabs />,
							collapsible: false,
						}}
						themeSwitch={{
							component: <ThemeToggle />,
						}}
					>
						{children}
					</DocsLayout>
				</RootProvider>
				<IconsSprite />
				<Script
					src="https://analytics.ahrefs.com/analytics.js"
					data-key="ti5gDNA17haJjb3IBUHy2g"
					strategy="afterInteractive"
				/>
			</body>
		</html>
	);
}
