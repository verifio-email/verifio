import * as Button from "@verifio/ui/button";
import Link from "next/link";

export default function Hero() {
	return (
		<div className="mx-auto min-h-[calc(dvh-200px)] max-w-7xl border-stroke-soft-100 border-r border-l py-20">
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
