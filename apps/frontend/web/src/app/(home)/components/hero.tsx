import * as Button from "@verifio/ui/button";
import Link from "next/link";
import { Icon } from "@verifio/ui/icon";

export default function Hero() {
	return (
		<div className="mx-auto min-h-[calc(dvh-200px)] max-w-7xl border-stroke-soft-100 border-r border-l py-20">
			<div className="mx-auto mb-6 flex justify-center">
				<a
					href="/dashboard/signup"
					className="group inline-flex items-center gap-1.5 rounded-full border border-stroke-soft-100 bg-surface-soft-100 py-px pr-0.5 pl-2 font-medium text-text-sub-600 text-xs transition-colors hover:bg-bg-soft-200/30"
				>
					<Icon name="mega-phone" className="h-3.5 w-3.5" />
					<span>10k Free Verifications • No Credit Card</span>
					<div className="flex h-6 w-6 items-center justify-center rounded-full bg-text-base-950">
						<Icon
							name="arrow-right-circle-filled"
							className="h-4 w-4 text-text-base-50 group-hover:text-primary-base"
						/>
					</div>
				</a>
			</div>
			<h1 className="title-h2 mx-auto max-w-xl text-center font-semibold">
				Verify Email Addresses in Real-Time
			</h1>
			<h2 className="mx-auto mt-6 max-w-lg text-center text-lg text-text-sub-600 leading-8">
				Free email verification API that's fast, accurate, and open-source.
				Verify emails instantly, reduce bounce rates by 98%, and protect your
				sender reputation.
			</h2>
			<div className="mt-10 flex items-center justify-center gap-4">
				<Link
					href="/contact"
					className={Button.buttonVariants({
						variant: "neutral",
						size: "medium",
					}).root({})}
				>
					Start Free Email Verification
				</Link>
				<Link
					href="/features/api-reference"
					className={Button.buttonVariants({
						mode: "stroke",
						variant: "neutral",
						size: "medium",
					}).root({})}
				>
					View API Docs
				</Link>
			</div>
		</div>
	);
}
