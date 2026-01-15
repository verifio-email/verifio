import "@fe/docs/app/global.css";
import { baseOptions } from "@fe/docs/app/layout.config";
import { cn } from "@fe/docs/lib/cn";
import { source } from "@fe/docs/lib/source";
import { IconsSprite } from "@verifio/ui/icon";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<html
			lang="en"
			className={cn("touch-manipulation scroll-smooth antialiased")}
			suppressHydrationWarning
		>
			<body className="flex min-h-screen flex-col">
				<RootProvider>
					<DocsLayout tree={source.pageTree} {...baseOptions}>
						{children}
					</DocsLayout>
				</RootProvider>
				<IconsSprite />
			</body>
		</html>
	);
}
