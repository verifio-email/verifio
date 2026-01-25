import * as Button from "@verifio/ui/button";
import { PricingSection } from "@verifio/web/components/pricing-section";
import Link from "next/link";

const faqs = [
	{
		q: "What counts as a verification?",
		a: "Each email address you verify counts as one verification, regardless of how many checks are performed on it.",
	},
	{
		q: "Do unused credits roll over?",
		a: "On annual plans, unused credits roll over for up to 3 months. Monthly plan credits reset each billing cycle.",
	},
	{
		q: "Can I change plans anytime?",
		a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.",
	},
	{
		q: "Is there a free trial for Pro?",
		a: "Yes, Pro comes with a 14-day free trial. No credit card required to start.",
	},
];

export default function PricingPage() {
	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section>
				<div className="mx-auto max-w-5xl border-stroke-soft-100/60 border-r border-l">
					<div className="sticky top-[65.5px] z-20 flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
						<span className="text-text-sub-600 text-xs">[01] PRICING</span>
						<span className="text-text-sub-600 text-xs">
							/ SIMPLE & TRANSPARENT
						</span>
					</div>
					<div className="px-10 py-16 text-center">
						<h1 className="mx-auto max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
							Simple, transparent pricing
						</h1>
						<p className="mx-auto mt-6 max-w-xl text-lg text-text-sub-600">
							Start free, scale as you grow. No hidden fees, no surprises.
						</p>
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<PricingSection showHeader={false} showHeadline={false} />

			{/* FAQ */}
			<section className="border-stroke-soft-100/60 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100/60 border-r border-l">
					<div className="sticky top-[65.5px] z-20 flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
						<span className="text-text-sub-600 text-xs">[03] FAQ</span>
						<span className="text-text-sub-600 text-xs">
							/ COMMON QUESTIONS
						</span>
					</div>
					<div className="grid gap-0 md:grid-cols-2">
						{faqs.map((faq, index) => (
							<div
								key={faq.q}
								className={`border-stroke-soft-100/60 p-8 ${index % 2 === 0 ? "border-r" : ""} ${index < 2 ? "border-b" : ""}`}
							>
								<h3 className="font-medium text-text-strong-950">{faq.q}</h3>
								<p className="mt-2 text-sm text-text-sub-600">{faq.a}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="border-stroke-soft-100/60 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100/60 border-r border-l">
					<div className="p-10 text-center md:p-16">
						<h2 className="font-semibold text-2xl text-text-strong-950">
							Not sure which plan is right for you?
						</h2>
						<p className="mt-2 text-text-sub-600">
							Create a free account or talk to our team for a custom quote.
						</p>
						<div className="mt-6 flex justify-center gap-4">
							<Link
								href="/signup"
								className={Button.buttonVariants({
									variant: "primary",
									size: "medium",
								}).root({})}
							>
								Get Started
							</Link>
							<Link
								href="/contact"
								className={Button.buttonVariants({
									variant: "neutral",
									mode: "stroke",
									size: "medium",
								}).root({})}
							>
								Contact Us
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
