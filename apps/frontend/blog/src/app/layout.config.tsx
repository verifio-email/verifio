import { LogoName } from "@verifio/ui/logo";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export const baseOptions: BaseLayoutProps = {
	nav: {
		title: <LogoName className="h-5" />,
		url: "https://verifio.email",
	},
};
