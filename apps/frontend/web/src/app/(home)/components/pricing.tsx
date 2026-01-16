"use client";

import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Line } from "rc-progress";
import { useMemo, useState } from "react";

// Credit pricing tiers for volume discounts
const CREDIT_TIERS = [
	{ credits: 1000, pricePerCredit: 0.002 },
	{ credits: 5000, pricePerCredit: 0.0018 },
	{ credits: 10000, pricePerCredit: 0.0015 },
	{ credits: 25000, pricePerCredit: 0.0012 },
	{ credits: 50000, pricePerCredit: 0.001 },
	{ credits: 100000, pricePerCredit: 0.0008 },
];

// Slider step values
const SLIDER_STEPS = [1000, 2500, 5000, 10000, 25000, 50000, 100000];

function calculatePrice(credits: number): number {
	const tier =
		CREDIT_TIERS.find((t) => credits <= t.credits) ||
		CREDIT_TIERS[CREDIT_TIERS.length - 1];
	return tier ? credits * tier.pricePerCredit : credits * 0.002;
}

function getPricePerCredit(credits: number): number {
	const tier =
		CREDIT_TIERS.find((t) => credits <= t.credits) ||
		CREDIT_TIERS[CREDIT_TIERS.length - 1];
	return tier ? tier.pricePerCredit : 0.002;
}

export function Pricing() {
	const { resolvedTheme } = useTheme();
	const [selectedCredits, setSelectedCredits] = useState(5000);
	const calculatedPrice = useMemo(
		() => calculatePrice(selectedCredits),
		[selectedCredits],
	);
	const pricePerK = useMemo(
		() => getPricePerCredit(selectedCredits) * 1000,
		[selectedCredits],
	);

	const sliderIndex = SLIDER_STEPS.findIndex((s) => s >= selectedCredits);
	const currentIndex =
		sliderIndex === -1 ? SLIDER_STEPS.length - 1 : sliderIndex;

	return (
		<div className="border-stroke-soft-100/60 border-t border-b dark:border-stroke-soft-100/40">
			<div className="mx-auto max-w-5xl border-stroke-soft-100/60 border-r border-l dark:border-stroke-soft-100/40">
				{/* Sticky Header */}
				<div className="sticky top-[66px] z-20 flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-4 md:px-10 dark:border-stroke-soft-100/40">
					<span className="text-text-sub-600 text-xs">[07] PRICING</span>
					<span className="text-text-sub-600 text-xs">/ VALUE PROPOSITION</span>
				</div>

				{/* Pricing Section */}
				<div className="pt-12 md:pt-16">
					{/* Pricing Header */}
					<div className="mb-10 text-center">
						<h2 className="font-semibold text-2xl text-text-sub-600 md:text-3xl">
							Simple <span className="text-text-strong-950">credit-based</span>{" "}
							pricing
						</h2>
						<p className="mx-auto mt-2 max-w-md text-sm text-text-sub-600 md:text-base">
							Only pay for what you use. No monthly commitments, no surprises.
						</p>
					</div>

					<div className="border-stroke-soft-200/50 border-t">
						<div className="mx-auto max-w-3xl px-6 pt-9 pb-8">
							{/* Progress line with thumb */}
							<div className="relative h-5">
								{/* rc-progress Line (visual only) */}
								<div className="-translate-y-1/2 absolute inset-x-0 top-1/2">
									<Line
										percent={(currentIndex / (SLIDER_STEPS.length - 1)) * 100}
										strokeWidth={0.5}
										strokeColor={
											resolvedTheme === "dark" ? "#ffffff" : "#000000"
										}
										trailWidth={0.5}
										trailColor={
											resolvedTheme === "dark"
												? "rgba(82, 82, 82, 0.5)"
												: "rgba(229, 231, 235, 0.5)"
										}
										strokeLinecap="round"
									/>
								</div>
								{/* Visual thumb */}
								<div
									className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 h-4 w-4 rounded-full border-2 border-bg-white-0 bg-text-strong-950 shadow-lg"
									style={{
										left: `${(currentIndex / (SLIDER_STEPS.length - 1)) * 100}%`,
									}}
								/>
								{/* Invisible range input for interaction */}
								<input
									type="range"
									min={0}
									max={SLIDER_STEPS.length - 1}
									step={1}
									value={currentIndex}
									onChange={(e) =>
										setSelectedCredits(
											SLIDER_STEPS[Number(e.target.value)] ?? 1000,
										)
									}
									className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
								/>
							</div>
							{/* Clickable tick labels */}
							<div className="-mx-[23px] flex justify-between">
								{SLIDER_STEPS.map((step, index) => (
									<button
										key={step}
										type="button"
										onClick={() => setSelectedCredits(step)}
										className={`text-xs transition-colors hover:text-text-strong-950 ${index !== 0 && index !== SLIDER_STEPS.length - 1 ? "pl-5" : ""} ${
											index === currentIndex
												? "font-medium text-text-strong-950"
												: "text-text-sub-600"
										}`}
									>
										${step.toLocaleString()}
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Pricing Cards - 3 columns */}
					<div className="overflow-hidden border-stroke-soft-200/50 border-t border-b">
						<div className="grid grid-cols-1 md:grid-cols-3">
							{/* Free Plan */}
							<div className="flex flex-col bg-bg-white-0">
								{/* Header */}
								<div className="border-stroke-soft-200/50 border-b p-5">
									<h3 className="font-semibold text-text-strong-950">
										Free Plan
									</h3>
									<p className="mt-1 text-sm text-text-sub-600 leading-relaxed">
										Let us support your side project for free. When you grow, we
										grow with you.
									</p>
								</div>

								{/* Credits */}
								<div className="border-stroke-soft-200/50 border-b px-5 py-3">
									<div className="flex items-center gap-2 text-sm text-text-sub-600">
										<Icon name="coins" className="h-3.5 w-3.5" />
										<span>100 credits (one-time)</span>
									</div>
								</div>

								{/* Price */}
								<div className="border-stroke-soft-200/50 border-b p-5">
									<div className="flex items-baseline gap-1">
										<span className="font-bold text-3xl text-text-strong-950">
											$0
										</span>
										<span className="text-sm text-text-sub-600">one-time</span>
									</div>
								</div>

								{/* CTA */}
								<div className="border-stroke-soft-200/50 border-b p-5">
									<Link href="/signup" className="block">
										<Button.Root
											mode="stroke"
											variant="neutral"
											size="small"
											className="w-full justify-center rounded-lg"
										>
											Get started
										</Button.Root>
									</Link>
								</div>

								{/* Features */}
								<div className="flex-1 p-5">
									<ul className="space-y-3">
										<li className="flex items-start gap-2 text-sm text-text-sub-600">
											<Icon
												name="check"
												className="mt-0.5 h-4 w-4 shrink-0 text-text-sub-600"
											/>
											<span>
												Verify{" "}
												<span className="font-medium text-text-strong-950">
													100
												</span>{" "}
												emails
											</span>
										</li>
										<li className="flex items-start gap-2 text-sm text-text-sub-600">
											<Icon
												name="check"
												className="mt-0.5 h-4 w-4 shrink-0 text-text-sub-600"
											/>
											<span>
												<span className="font-medium text-text-strong-950">
													1
												</span>{" "}
												API key
											</span>
										</li>
										<li className="flex items-start gap-2 text-sm text-text-sub-600">
											<Icon
												name="check"
												className="mt-0.5 h-4 w-4 shrink-0 text-text-sub-600"
											/>
											<span>Community support</span>
										</li>
									</ul>
								</div>
							</div>

							{/* Pay as you go Plan */}
							<div className="relative flex flex-col border-stroke-soft-200/50 border-t bg-neutral-alpha-10/50 md:border-t-0 md:border-l">
								{/* Popular badge */}
								<div className="absolute top-4 right-4">
									<span className="rounded-full border bg-neutral-alpha-10 px-2 py-0.5 font-medium text-[10px]">
										Most popular
									</span>
								</div>

								{/* Header */}
								<div className="border-stroke-soft-200/50 border-b p-5">
									<h3 className="font-semibold text-text-strong-950">
										Pay as you go
									</h3>
									<p className="mt-1 text-sm text-text-sub-600 leading-relaxed">
										Your startup is growing and we think you need this. Scale
										without limits.
									</p>
								</div>

								{/* Credits */}
								<div className="border-stroke-soft-200/50 border-b px-5 py-3">
									<div className="flex items-center gap-2 text-sm text-text-sub-600">
										<Icon name="coins" className="h-3.5 w-3.5" />
										<span>
											<span className="font-medium text-text-strong-950">
												{selectedCredits.toLocaleString()}
											</span>{" "}
											credits
										</span>
									</div>
								</div>

								{/* Price */}
								<div className="border-stroke-soft-200/50 border-b p-5">
									<div className="flex items-baseline gap-1">
										<span className="font-bold text-3xl text-text-strong-950">
											${calculatedPrice.toFixed(0)}
										</span>
										<span className="text-sm text-text-sub-600">one-time</span>
									</div>
								</div>

								{/* CTA */}
								<div className="border-stroke-soft-200/50 border-b p-5">
									<Link href="/signup" className="block">
										<Button.Root
											mode="filled"
											variant="neutral"
											size="small"
											className="w-full justify-center rounded-lg"
										>
											Subscribe
										</Button.Root>
									</Link>
								</div>

								{/* Features */}
								<div className="flex-1 p-5">
									<ul className="space-y-3">
										<li className="flex items-start gap-2 text-sm text-text-sub-600">
											<Icon
												name="check"
												className="mt-0.5 h-4 w-4 shrink-0 text-text-sub-600"
											/>
											<span>
												Verify{" "}
												<span className="font-medium text-text-strong-950">
													{selectedCredits.toLocaleString()}
												</span>{" "}
												emails
											</span>
										</li>
										<li className="flex items-start gap-2 text-sm text-text-sub-600">
											<Icon
												name="check"
												className="mt-0.5 h-4 w-4 shrink-0 text-text-sub-600"
											/>
											<span>
												<span className="font-medium text-text-strong-950">
													5
												</span>{" "}
												API keys
											</span>
										</li>
										<li className="flex items-start gap-2 text-sm text-text-sub-600">
											<Icon
												name="check"
												className="mt-0.5 h-4 w-4 shrink-0 text-text-sub-600"
											/>
											<span>Email support</span>
										</li>
										<li className="flex items-start gap-2 text-sm text-text-sub-600">
											<Icon
												name="check"
												className="mt-0.5 h-4 w-4 shrink-0 text-text-sub-600"
											/>
											<span>
												<span className="font-medium text-text-strong-950">
													${pricePerK.toFixed(2)}
												</span>{" "}
												per extra 1k credits
											</span>
										</li>
									</ul>
								</div>
							</div>

							{/* Enterprise Plan */}
							<div className="flex flex-col border-stroke-soft-200/50 border-t bg-bg-white-0 md:border-t-0 md:border-l">
								{/* Header */}
								<div className="border-stroke-soft-200/50 border-b p-5">
									<h3 className="font-semibold text-text-strong-950">
										Enterprise
									</h3>
									<p className="mt-1 text-sm text-text-sub-600 leading-relaxed">
										Built for high volume and speed. Custom pricing for your
										needs.
									</p>
								</div>

								{/* Credits */}
								<div className="border-stroke-soft-200/50 border-b px-5 py-3">
									<div className="flex items-center gap-2 text-sm text-text-sub-600">
										<Icon name="infinity" className="h-3.5 w-3.5" />
										<span>Unlimited credits</span>
									</div>
								</div>

								{/* Price */}
								<div className="border-stroke-soft-200/50 border-b p-5">
									<div className="flex items-baseline gap-1">
										<span className="font-bold text-3xl text-text-strong-950">
											Custom
										</span>
									</div>
								</div>

								{/* CTA */}
								<div className="border-stroke-soft-200/50 border-b p-5">
									<Link href="/contact" className="block">
										<Button.Root
											mode="stroke"
											variant="neutral"
											size="small"
											className="w-full justify-center rounded-lg"
										>
											Contact us
										</Button.Root>
									</Link>
								</div>

								{/* Features */}
								<div className="flex-1 p-5">
									<ul className="space-y-3">
										<li className="flex items-start gap-2 text-sm text-text-sub-600">
											<Icon
												name="check"
												className="mt-0.5 h-4 w-4 shrink-0 text-text-sub-600"
											/>
											<span>
												<span className="font-medium text-text-strong-950">
													Unlimited
												</span>{" "}
												verifications
											</span>
										</li>
										<li className="flex items-start gap-2 text-sm text-text-sub-600">
											<Icon
												name="check"
												className="mt-0.5 h-4 w-4 shrink-0 text-text-sub-600"
											/>
											<span>
												<span className="font-medium text-text-strong-950">
													Unlimited
												</span>{" "}
												API keys
											</span>
										</li>
										<li className="flex items-start gap-2 text-sm text-text-sub-600">
											<Icon
												name="check"
												className="mt-0.5 h-4 w-4 shrink-0 text-text-sub-600"
											/>
											<span>Dedicated support</span>
										</li>
										<li className="flex items-start gap-2 text-sm text-text-sub-600">
											<Icon
												name="check"
												className="mt-0.5 h-4 w-4 shrink-0 text-text-sub-600"
											/>
											<span>SLA available</span>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>

					{/* BYOK Explainer */}
					<div className="mt-10 border-stroke-soft-200/50 border-t px-6 py-10 md:px-10">
						<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
							<div className="flex-1">
								<h3 className="mb-2 font-semibold text-lg text-text-strong-950">
									Self-host with your own infrastructure
								</h3>
								<p className="mb-4 max-w-xl text-sm text-text-sub-600 leading-relaxed">
									Own your verification infrastructure entirely. Use your own
									SMTP providers, DNS resolvers, and API keys. Deploy on your
									servers with full control over data, costs, and scaling.
								</p>
								<div className="flex flex-col gap-2">
									<div className="inline-flex items-center gap-2">
										<Icon name="shield" className="h-4 w-4" />
										<span className="text-text-sub-600 text-xs">
											Full data ownership
										</span>
									</div>
									<div className="inline-flex items-center gap-2">
										<Icon name="infinity" className="h-4 w-4" />
										<span className="text-text-sub-600 text-xs">
											Unlimited Credits
										</span>
									</div>
								</div>
							</div>
							<div className="md:flex-shrink-0">
								<Link href="/docs/self-host">
									<Button.Root
										mode="stroke"
										size="small"
										variant="neutral"
										className="rounded-lg"
									>
										<Icon name="book-open" className="h-4 w-4" />
										Self-hosting Guide
										<Icon name="chevron-right" className="h-4 w-4" />
									</Button.Root>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Pricing;
