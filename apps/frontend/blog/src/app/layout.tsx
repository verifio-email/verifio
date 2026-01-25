import "@fe/blog/app/global.css";
import { cn } from "@fe/blog/lib/cn";
import { source } from "@fe/blog/lib/source";
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
                                secondary: true,
                            },
                        ]}
                        sidebar={{
                            enabled: false,
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
