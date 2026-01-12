"use client";

import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";
import Link from "next/link";

const comparisonData = [
	{
		feature: "Open-source core",
		verifio: { status: "check", label: "Yes" },
		traditional: { status: "cross", label: "No" },
	},
	{
		feature: "Explainable results",
		verifio: { status: "check", label: "Yes" },
		traditional: { status: "cross", label: "No" },
	},
	{
		feature: "Self-host option",
		verifio: { status: "check", label: "Yes" },
		traditional: { status: "cross", label: "No" },
	},
	{
		feature: "API & SDK first",
		verifio: { status: "check", label: "Yes" },
		traditional: { status: "warning", label: "Partial" },
	},
	{
		feature: "Free tier available",
		verifio: { status: "check", label: "Yes" },
		traditional: { status: "warning", label: "Limited" },
	},
	{
		feature: "Bring your own API key",
		verifio: { status: "check", label: "Yes" },
		traditional: { status: "cross", label: "No" },
	},
];

function StatusIcon({ status }: { status: string }) {
	if (status === "check") {
		return (
			<div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/15">
				<Icon name="check" className="h-3.5 w-3.5 text-green-500" />
			</div>
		);
	}
	if (status === "warning") {
		return (
			<div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/15">
				<Icon name="alert" className="h-3.5 w-3.5 text-amber-500" />
			</div>
		);
	}
	return (
		<div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10">
			<Icon name="close" className="h-3.5 w-3.5 text-red-400" />
		</div>
	);
}

const pricingTiers = [
	{
		id: "free",
		name: "Free",
		description: "Perfect for trying out Verifio",
		price: "$0",
		period: "forever",
		highlight: false,
		features: [
			"100 verifications/month",
			"Basic API access",
			"Community support",
			"Single API key",
		],
		cta: "Get Started",
		ctaVariant: "neutral" as const,
	},
	{
		id: "pro",
		name: "Pro",
		description: "For growing teams and products",
		price: "$29",
		period: "/month",
		highlight: true,
		features: [
			"10,000 verifications/month",
			"Priority API access",
			"Email support",
			"Multiple API keys",
			"Webhook support",
			"Batch verification",
		],
		cta: "Start Free Trial",
		ctaVariant: "primary" as const,
	},
	{
		id: "byok",
		name: "Bring Your Own Key",
		description: "Use your own SMTP/provider keys",
		price: "Self-Host",
		period: "or usage-based",
		highlight: false,
		features: [
			"Unlimited verifications",
			"Your own infrastructure",
			"Full data ownership",
			"Custom integrations",
			"Dedicated support",
			"SLA available",
		],
		cta: "Contact Us",
		ctaVariant: "neutral" as const,
	},
];

export function ComparisonPricing() {
	return (
		<div className="border-stroke-soft-100 border-t border-b">
			<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
				{/* Sticky Header */}
				<div className="sticky top-[66px] z-20 flex items-center justify-between border-stroke-soft-100 border-b bg-bg-white-0 px-4 py-4 md:px-10">
					<span className="text-text-sub-600 text-xs">
						[07] COMPARISON & PRICING
					</span>
					<span className="text-text-sub-600 text-xs">/ VALUE PROPOSITION</span>
				</div>

				{/* Comparison Section */}
				<div className="flex flex-col items-center gap-8 border-stroke-soft-100 border-b px-6 py-12 md:px-10 md:py-16">
					{/* Section Header */}
					<div className="text-center">
						<motion.div
							className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-base/20 bg-primary-base/5 px-4 py-2"
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<Icon
								name="arrows-switch"
								className="h-4 w-4 text-primary-base"
							/>
							<span className="font-medium text-primary-base text-sm">
								How we compare
							</span>
						</motion.div>
						<h2 className="font-semibold text-2xl text-text-strong-950 md:text-3xl">
							The <span className="text-primary-base">Verifio</span> difference
						</h2>
						<p className="mt-2 text-sm text-text-sub-600 md:text-base">
							Built from the ground up with transparency and flexibility in mind
						</p>
					</div>

					{/* Comparison Table */}
					<motion.div
						className="w-full max-w-2xl overflow-hidden rounded-xl border border-stroke-soft-100"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						{/* Table Header */}
						<div className="grid grid-cols-3 border-stroke-soft-100 border-b bg-bg-soft-200/30 px-4 py-3">
							<div className="text-left font-medium text-text-sub-600 text-xs uppercase tracking-wider">
								Feature
							</div>
							<div className="text-center font-medium text-primary-base text-xs uppercase tracking-wider">
								Verifio
							</div>
							<div className="text-center font-medium text-text-sub-600 text-xs uppercase tracking-wider">
								Traditional
							</div>
						</div>

						{/* Table Body */}
						{comparisonData.map((row, index) => (
							<motion.div
								key={row.feature}
								className={`grid grid-cols-3 items-center px-4 py-3 transition-colors hover:bg-primary-base/5 ${
									index !== comparisonData.length - 1
										? "border-stroke-soft-100 border-b"
										: ""
								}`}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
							>
								<div className="text-left text-sm text-text-strong-950">
									{row.feature}
								</div>
								<div className="flex items-center justify-center gap-2">
									<StatusIcon status={row.verifio.status} />
								</div>
								<div className="flex items-center justify-center gap-2">
									<StatusIcon status={row.traditional.status} />
								</div>
							</motion.div>
						))}
					</motion.div>

					{/* Alternative Badge */}
					<motion.div
						className="flex items-center gap-2 rounded-lg bg-bg-soft-200/50 px-4 py-2 text-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.6 }}
					>
						<span className="text-sm text-text-sub-600">
							Verifio is an{" "}
							<span className="font-semibold text-text-strong-950">
								open-source alternative
							</span>{" "}
							to ZeroBounce & Emailable
						</span>
					</motion.div>
				</div>

				{/* Pricing Section */}
				<div className="px-6 py-12 md:px-10 md:py-16">
					{/* Pricing Header */}
					<div className="mb-10 text-center">
						<motion.div
							className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-base/20 bg-primary-base/5 px-4 py-2"
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<Icon name="banknotes" className="h-4 w-4 text-primary-base" />
							<span className="font-medium text-primary-base text-sm">
								Simple Pricing
							</span>
						</motion.div>
						<h2 className="font-semibold text-2xl text-text-strong-950 md:text-3xl">
							Choose your{" "}
							<span className="text-primary-base">verification path</span>
						</h2>
						<p className="mx-auto mt-2 max-w-md text-sm text-text-sub-600 md:text-base">
							Start free, scale as you grow, or bring your own infrastructure
							for complete control
						</p>
					</div>

					{/* Pricing Cards */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
						{pricingTiers.map((tier, index) => (
							<motion.div
								key={tier.id}
								className={`group relative flex flex-col rounded-2xl border p-6 transition-all duration-300 ${
									tier.highlight
										? "border-primary-base/30 bg-gradient-to-br from-primary-base/5 to-transparent"
										: "border-stroke-soft-100 hover:border-stroke-soft-200"
								}`}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
								whileHover={{ y: -4 }}
							>
								{/* Popular badge */}
								{tier.highlight && (
									<div className="absolute -top-3 left-1/2 -translate-x-1/2">
										<span className="rounded-full bg-primary-base px-3 py-1 font-medium text-white text-xs">
											Most Popular
										</span>
									</div>
								)}

								{/* Tier header */}
								<div className="mb-4">
									<h3 className="font-semibold text-lg text-text-strong-950">
										{tier.name}
									</h3>
									<p className="mt-1 text-sm text-text-sub-600">
										{tier.description}
									</p>
								</div>

								{/* Price */}
								<div className="mb-6">
									<div className="flex items-baseline gap-1">
										<span className="font-bold text-3xl text-text-strong-950">
											{tier.price}
										</span>
										<span className="text-sm text-text-sub-600">
											{tier.period}
										</span>
									</div>
								</div>

								{/* Features */}
								<ul className="mb-6 flex-1 space-y-3">
									{tier.features.map((feature, i) => (
										<li
											key={i}
											className="flex items-start gap-2 text-sm text-text-sub-600"
										>
											<Icon
												name="check"
												className={`mt-0.5 h-4 w-4 shrink-0 ${
													tier.highlight
														? "text-primary-base"
														: "text-green-500"
												}`}
											/>
											{feature}
										</li>
									))}
								</ul>

								{/* CTA */}
								<Link
									href={tier.id === "byok" ? "/contact" : "/signup"}
									className="block"
								>
									<Button.Root
										mode={tier.highlight ? "filled" : "stroke"}
										variant={tier.ctaVariant}
										size="medium"
										className="w-full justify-center rounded-full"
									>
										{tier.cta}
										<Icon name="chevron-right" className="h-4 w-4 stroke-1" />
									</Button.Root>
								</Link>
							</motion.div>
						))}
					</div>

					{/* BYOK Explainer */}
					<motion.div
						className="mt-10 rounded-xl border border-stroke-soft-100 bg-gradient-to-r from-bg-soft-200/30 to-transparent p-6 md:p-8"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.6 }}
					>
						<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
							<div className="flex-1">
								<div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary-base/10 px-3 py-1">
									<Icon name="key" className="h-3.5 w-3.5 text-primary-base" />
									<span className="font-medium text-xs uppercase tracking-wider text-primary-base">
										Bring Your Own Key
									</span>
								</div>
								<h3 className="mb-2 font-semibold text-lg text-text-strong-950">
									Self-host with your own infrastructure
								</h3>
								<p className="max-w-xl text-sm leading-relaxed text-text-sub-600">
									Own your verification infrastructure entirely. Use your own
									SMTP providers, DNS resolvers, and API keys. Deploy on your
									servers with full control over data, costs, and scaling. Pay
									only for what you use with your own providers.
								</p>
							</div>
							<div className="flex flex-col gap-3 md:items-end">
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-2 rounded-lg border border-stroke-soft-100 bg-bg-white-0 px-3 py-2">
										<Icon name="shield" className="h-4 w-4 text-green-500" />
										<span className="text-xs text-text-sub-600">
											Full data ownership
										</span>
									</div>
									<div className="flex items-center gap-2 rounded-lg border border-stroke-soft-100 bg-bg-white-0 px-3 py-2">
										<Icon
											name="infinity"
											className="h-4 w-4 text-primary-base"
										/>
										<span className="text-xs text-text-sub-600">
											Unlimited scale
										</span>
									</div>
								</div>
								<Link href="/docs/self-host">
									<Button.Root
										mode="stroke"
										size="small"
										variant="neutral"
										className="rounded-full"
									>
										<Icon name="book-open" className="h-4 w-4" />
										Self-hosting Guide
										<Icon name="chevron-right" className="h-4 w-4 stroke-1" />
									</Button.Root>
								</Link>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}

export default ComparisonPricing;
