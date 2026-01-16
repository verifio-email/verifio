import { AnimatedAlternative } from "./animated-alternative";
import { EmailVerificationDemo } from "./email-verification-demo";
import { ResponseDisplay } from "./response-display";
import { VerificationProvider } from "./verification-context";

export default function Hero() {
	return (
		<div className="border-stroke-soft-100/60 dark:border-stroke-soft-100/40 border-r border-b border-l">
			<div className="mx-auto max-w-5xl">
				<div className="border-stroke-soft-100/60 dark:border-stroke-soft-100/40 border-r border-b border-l">
					<div className="mx-auto max-w-3xl border-stroke-soft-100/60 dark:border-stroke-soft-100/40 border-r border-l px-4 pt-12 pb-16 md:px-0 md:pt-20 md:pb-28">
						<div className="mx-auto mb-4 flex justify-center md:mb-6">
							<AnimatedAlternative />
						</div>
						<h1 className="title-h1 mx-auto max-w-2xl text-center font-semibold">
							Open-Source Email Verification Infrastructure
						</h1>
						<p className="mx-auto mt-4 max-w-lg px-2 text-center text-sm text-text-sub-600 md:mt-6 md:px-0 md:text-base">
							Validate emails instantly, reduce bounce rates, and protect your
							sender reputation in real time — with a{" "}
							<a
								href="https://github.com/reloop-labs/verifio"
								target="_blank"
								className="rounded-lg bg-bg-soft-200/50 px-1.5 py-px font-medium text-text-base-600"
								rel="noopener"
							>
								fully open-source core
							</a>
						</p>
					</div>
				</div>
			</div>
			<VerificationProvider>
				<EmailVerificationDemo />
				<ResponseDisplay />
			</VerificationProvider>
		</div>
	);
}
