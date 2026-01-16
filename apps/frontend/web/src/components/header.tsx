import { LogoName } from "@verifio/ui/logo";
import Link from "next/link";
import { HeaderAction } from "./header.action";

export const Header = () => {
	return (
		<div className="sticky top-0 z-50 border-stroke-soft-100/60 border-t border-b bg-bg-white-0">
			<header
				className="relative mx-auto flex h-16 w-full max-w-5xl flex-1 items-center justify-between gap-4 border-stroke-soft-100/60 border-r border-l px-4 lg:p-[18px]"
				itemScope
				itemType="https://schema.org/Organization"
			>
				<div className="flex items-center">
					<Link
						href="/"
						aria-label="Verifio - Go to homepage"
						title="Verifio - Email Verification Service"
						itemProp="url"
					>
						<LogoName className="w-32" />
						<meta itemProp="name" content="Verifio" />
					</Link>
				</div>
				<nav aria-label="Main navigation">
					<HeaderAction />
				</nav>
			</header>
		</div>
	);
};
