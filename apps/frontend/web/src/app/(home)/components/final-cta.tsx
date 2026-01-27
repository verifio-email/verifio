import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";
import { EmailCounter } from "./email-counter";

export function FinalCTA() {
	return (
		<div className="border-stroke-soft-100/60 border-t border-b dark:border-stroke-soft-100/40">
			<div className="mx-auto max-w-5xl border-stroke-soft-100/60 border-r border-l dark:border-stroke-soft-100/40">
				<div className="grid min-h-[280px] grid-cols-1 items-center gap-8 px-6 py-12 md:grid-cols-4 md:px-10 md:py-16">
					{/* Left Content */}
					<div className="col-span-3 flex flex-col items-center text-center md:items-start md:pr-20 md:text-left">
						<h2 className="max-w-lg font-medium text-text-sub-600 text-xl tracking-tight md:text-2xl lg:text-3xl">
							<span className="font-semibold text-text-strong-950">
								1,000 free credits every month, forever.
							</span>{" "}
							<span className="text-text-sub-600">
								No credit card required. Start verifying emails today.
							</span>
						</h2>

						{/* CTA Buttons */}
						<div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
							<Link href="/signup">
								<Button.Root variant="neutral" size="small">
									Start for free
								</Button.Root>
							</Link>
							<Link
								href="https://github.com/reloop-labs/verifio"
								target="_blank"
								rel="noopener"
							>
								<Button.Root mode="stroke" variant="neutral" size="small">
									<Icon name="github" className="h-4 w-4" />
									Star on GitHub
								</Button.Root>
							</Link>
						</div>
					</div>
					<div className="border-stroke-soft-100/60 border-t pt-8 md:border-t-0 md:pt-0 dark:border-stroke-soft-100/40">
						<EmailCounter />
					</div>
				</div>
			</div>
		</div>
	);
}

export default FinalCTA;
