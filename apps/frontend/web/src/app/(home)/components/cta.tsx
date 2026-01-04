import * as Button from "@verifio/ui/button";
import { Logo3D } from "@verifio/ui/logo";
import Link from "next/link";

const CTA = () => {
	return (
		<section className="border-stroke-soft-100/60">
			<div className="relative mx-auto max-w-7xl flex-1 border-stroke-soft-100/60 border-r border-l">
				<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
					<span className="text-text-sub-600 text-xs">[05] GET STARTED</span>
					<span className="text-text-sub-600 text-xs">
						/ START VERIFYING TODAY
					</span>
				</div>
				<div className="grid grid-cols-2 justify-center items-center p-20">
					<div className="flex-1 text-left">
						<h2 className="max-w-2xl font-semibold text-3xl text-text-strong-950">
							Start Verifying Emails for Free. <br />
							<span className="text-text-sub-600 leading-8">
								10,000 free email verifications per month.{" "}
								<span className="text-text-strong-950">
									No credit card required.
								</span>
							</span>
						</h2>
						<div className="flex flex-col gap-4 pt-6 sm:flex-row">
							<Link
								href="/contact"
								className={Button.buttonVariants({
									variant: "neutral",
									size: "xsmall",
								}).root({})}
							>
								Verify Email Free
							</Link>
							<Link
								href="/pricing"
								className={Button.buttonVariants({
									mode: "stroke",
									variant: "neutral",
									size: "xsmall",
								}).root({})}
							>
								See Pricing
							</Link>
						</div>
					</div>
					<div className="flex flex-1 items-center justify-center">
						<Logo3D className="h-64 w-64" />
					</div>
				</div>
			</div>
		</section>
	);
};

export default CTA;
