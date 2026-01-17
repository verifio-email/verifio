import { LogoName } from "@verifio/ui/logo";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */

export const baseOptions: BaseLayoutProps = {
	nav: {
		title: <LogoName className="h-5" />,
		url: "https://verifio.email",
	},
	// see https://fumadocs.dev/docs/ui/navigation/links
};
