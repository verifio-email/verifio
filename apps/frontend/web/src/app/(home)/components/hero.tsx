import * as Button from "@verifio/ui/button";
import Link from "next/link";
import { Icon } from "@verifio/ui/icon";
import { EmailVerificationDemo } from "./email-verification-demo";
import { ResponseDisplay } from "./response-display";

export default function Hero() {
	return (
		<div className="border-stroke-soft-100/60 border-r border-b border-l">
			<div className="mx-auto max-w-7xl">
				<div className="border-stroke-soft-100/60 border-r border-b border-l">
					<div className="mx-auto max-w-3xl border-stroke-soft-100/60 border-r border-l pt-20 pb-28">
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
						<h1 className="title-h1 text-center font-semibold">
							99.9% Accurate Email Verification Platform
						</h1>
						<p className="mx-auto mt-6 max-w-lg text-center text-text-sub-600">
							Validate emails instantly, reduce bounce rates, and protect your
							sender reputation in real-time.{" "}
							<a
								href="https://github.com/reloop-labs/verifio"
								target="_blank"
								className="rounded-lg bg-bg-soft-200/50 px-1.5 py-px font-medium text-text-base-600"
								rel="noopener"
							>
								It's also open-source.
							</a>
						</p>
					</div>
				</div>
			</div>
			<EmailVerificationDemo />
			<ResponseDisplay />
		</div>
	);
}
