import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";

const plans = [
	{
		name: "Free",
		price: "$0",
		period: "forever",
		description: "Perfect for testing and small projects",
		credits: "1,000",
		features: [
			"1,000 verifications/month",
			"Single email checker",
			"Basic syntax & MX checks",
			"API access",
			"Community support",
		],
		cta: "Get Started Free",
		ctaVariant: "neutral" as const,
		popular: false,
	},
	{
		name: "Pro",
		price: "$49",
		period: "/month",
		description: "For growing businesses and teams",
		credits: "50,000",
		features: [
			"50,000 verifications/month",
			"Bulk email verification",
			"All verification checks",
			"Priority API access",
			"Webhook integrations",
			"CSV import/export",
			"Email support",
		],
		cta: "Start Pro Trial",
		ctaVariant: "primary" as const,
		popular: true,
	},
	{
		name: "Enterprise",
		price: "Custom",
		period: "",
		description: "For high-volume and custom needs",
		credits: "Unlimited",
		features: [
			"Unlimited verifications",
			"Dedicated infrastructure",
			"Custom API limits",
			"SLA guarantee (99.9%)",
			"HIPAA/SOC2 compliance",
			"Dedicated support manager",
			"Custom integrations",
			"On-premise deployment",
		],
		cta: "Contact Sales",
		ctaVariant: "neutral" as const,
		popular: false,
	},
];

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
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[01] PRICING</span>
						<span className="text-sm text-text-sub-600">
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

			{/* Pricing Cards */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="grid gap-0 md:grid-cols-3">
						{plans.map((plan, index) => (
							<div
								key={plan.name}
								className={`relative flex flex-col border-stroke-soft-100 p-8 ${index < 2 ? "border-r" : ""} ${plan.popular ? "bg-primary-50/30" : ""}`}
							>
								{plan.popular && (
									<div className="-top-px absolute right-0 left-0 h-1 bg-primary-500" />
								)}
								{plan.popular && (
									<span className="mb-4 w-fit rounded-full bg-primary-500 px-3 py-1 font-medium text-white text-xs">
										Most Popular
									</span>
								)}
								<h3 className="font-semibold text-text-strong-950 text-xl">
									{plan.name}
								</h3>
								<div className="mt-4 flex items-baseline">
									<span className="font-bold text-4xl text-text-strong-950">
										{plan.price}
									</span>
									{plan.period && (
										<span className="ml-1 text-text-sub-600">
											{plan.period}
										</span>
									)}
								</div>
								<p className="mt-2 text-sm text-text-sub-600">
									{plan.description}
								</p>
								<div className="mt-4 rounded-lg bg-bg-weak-50 p-3 text-center">
									<span className="font-semibold text-lg text-text-strong-950">
										{plan.credits}
									</span>
									<span className="ml-1 text-sm text-text-sub-600">
										verifications/mo
									</span>
								</div>
								<ul className="mt-6 flex-1 space-y-3">
									{plan.features.map((feature) => (
										<li
											key={feature}
											className="flex items-start gap-2 text-sm text-text-sub-600"
										>
											<span className="mt-0.5 text-green-500">✓</span>
											{feature}
										</li>
									))}
								</ul>
								<Link
									href={plan.name === "Enterprise" ? "/contact" : "/signup"}
									className={`mt-8 ${Button.buttonVariants({
										variant: plan.ctaVariant,
										mode: plan.popular ? "filled" : "stroke",
										size: "medium",
									}).root({})}`}
								>
									{plan.cta}
								</Link>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Pay As You Go */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">
							[02] PAY AS YOU GO
						</span>
						<span className="text-sm text-text-sub-600">
							/ ADDITIONAL CREDITS
						</span>
					</div>
					<div className="grid gap-6 p-10 md:grid-cols-4">
						{[
							{ credits: "10K", price: "$10", perEmail: "$0.001" },
							{ credits: "50K", price: "$40", perEmail: "$0.0008" },
							{ credits: "100K", price: "$70", perEmail: "$0.0007" },
							{ credits: "500K", price: "$300", perEmail: "$0.0006" },
						].map((tier) => (
							<div
								key={tier.credits}
								className="rounded-xl border border-stroke-soft-100 bg-white p-6 text-center transition-all hover:border-primary-500/50"
							>
								<p className="font-bold text-2xl text-text-strong-950">
									{tier.credits}
								</p>
								<p className="text-sm text-text-sub-600">credits</p>
								<p className="mt-3 font-semibold text-text-strong-950 text-xl">
									{tier.price}
								</p>
								<p className="text-text-sub-600 text-xs">
									{tier.perEmail}/email
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* FAQ */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[03] FAQ</span>
						<span className="text-sm text-text-sub-600">
							/ COMMON QUESTIONS
						</span>
					</div>
					<div className="grid gap-0 md:grid-cols-2">
						{faqs.map((faq, index) => (
							<div
								key={faq.q}
								className={`border-stroke-soft-100 p-8 ${index % 2 === 0 ? "border-r" : ""} ${index < 2 ? "border-b" : ""}`}
							>
								<h3 className="font-medium text-text-strong-950">{faq.q}</h3>
								<p className="mt-2 text-sm text-text-sub-600">{faq.a}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="p-10 text-center md:p-16">
						<h2 className="font-semibold text-2xl text-text-strong-950">
							Not sure which plan is right for you?
						</h2>
						<p className="mt-2 text-text-sub-600">
							Try our free email checker or talk to our team for a custom quote.
						</p>
						<div className="mt-6 flex justify-center gap-4">
							<Link
								href="/tools/email-checker"
								className={Button.buttonVariants({
									variant: "primary",
									size: "medium",
								}).root({})}
							>
								Try Free Tool
							</Link>
							<Link
								href="/contact"
								className={Button.buttonVariants({
									variant: "neutral",
									mode: "stroke",
									size: "medium",
								}).root({})}
							>
								Contact Sales
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
