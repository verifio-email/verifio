import { LogoName } from "@verifio/ui/logo";
import Link from "next/link";
import { HeaderAction } from "./header.action";

export const Header = () => {
	return (
		<div className="sticky top-0 z-10 border-stroke-soft-100/60 border-t border-b bg-bg-white-0">
			<header className="relative mx-auto flex h-16 w-full max-w-7xl flex-1 items-center justify-between gap-4 border-stroke-soft-100/60 border-r border-l px-4 lg:p-[18px]">
				<div className="flex items-center">
					<Link href="/">
						<LogoName className="w-32" />
					</Link>
				</div>
				<HeaderAction />
			</header>
		</div>
	);
};
