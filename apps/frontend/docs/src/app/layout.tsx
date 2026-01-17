import "@fe/docs/app/global.css";
import { SidebarTabs } from "@fe/docs/components/sidebar-tabs";
import { ThemeToggle } from "@fe/docs/components/theme-toggle";
import { cn } from "@fe/docs/lib/cn";
import { source } from "@fe/docs/lib/source";
import { IconsSprite } from "@verifio/ui/icon";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import { baseOptions } from "./layout.config";

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
						githubUrl="https://github.com/verifio/verifio"
						tabMode="navbar"
						links={[
							{
								type: "button",
								text: "Sign In",
								url: "https://verfio.email/dashboard/login",
								secondary: true,
							},
							{
								type: "button",
								text: "Get Started",
								url: "https://verfio.email/dashboard/signup",
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
			</body>
		</html>
	);
}
