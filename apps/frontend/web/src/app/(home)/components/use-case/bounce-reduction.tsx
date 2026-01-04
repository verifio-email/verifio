"use client";

import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";

export const BounceReduction = () => {
	return (
		<div className="border-stroke-soft-200/50 border-b">
			<div className="grid grid-cols-1 lg:grid-cols-2">
				{/* Left Content Section */}
				<div className="flex flex-col justify-center space-y-6 p-10 md:p-16 lg:p-20">
					{/* Label */}
					<div className="flex items-center gap-2">
						<Icon name="mail-check-02" className="h-4 w-4 text-text-sub-600" />
						<span className="text-sm text-text-sub-600">
							Reduce bounce rates
						</span>
					</div>

					{/* Heading */}
					<h3 className="font-semibold text-3xl text-text-strong-950 tracking-tight md:text-4xl">
						98% fewer bounces
					</h3>

					{/* Description */}
					<p className="max-w-md text-base text-text-sub-600 leading-relaxed">
						Verify email addresses before sending to eliminate hard bounces.
						Real-time validation checks syntax, domain, and mailbox existence.
					</p>

					{/* CTA Button */}
					<button
						type="button"
						className="inline-flex w-fit items-center gap-2 rounded-lg bg-bg-strong-950 px-5 py-2.5 font-medium text-sm text-white transition-all hover:bg-bg-strong-950/90"
					>
						Learn more
						<Icon name="arrow-right" className="h-4 w-4" />
					</button>
				</div>

				{/* Right Visual Section */}
				<div className="flex items-center justify-center border-stroke-soft-200/50 p-8 md:p-12 lg:border-l lg:p-16">
					<div className="w-full max-w-sm space-y-6">
						{/* Header with status */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
								<span className="font-medium text-sm text-text-sub-600">
									Email Verification
								</span>
							</div>
							<span className="text-text-sub-600 text-xs">
								Real-time • Updated now
							</span>
						</div>

						{/* Before Card */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4 }}
							viewport={{ once: true }}
							className="rounded-xl border border-stroke-soft-200/50 bg-bg-white-0 p-5 shadow-sm"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
										<Icon
											name="mail-open-02"
											className="h-5 w-5 text-red-500"
										/>
									</div>
									<div>
										<p className="font-medium text-sm text-text-strong-950">
											Before Verification
										</p>
										<p className="text-text-sub-600 text-xs">
											High bounce rate
										</p>
									</div>
								</div>
								<div className="text-right">
									<p className="font-bold text-2xl text-red-600">12.3%</p>
									<p className="text-text-sub-600 text-xs">Bounce rate</p>
								</div>
							</div>
							<div className="mt-4">
								<div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
									<motion.div
										initial={{ width: 0 }}
										whileInView={{ width: "12.3%" }}
										transition={{ duration: 0.8, delay: 0.2 }}
										viewport={{ once: true }}
										className="h-2 rounded-full bg-red-500"
									/>
								</div>
							</div>
						</motion.div>

						{/* Arrow indicator */}
						<div className="flex justify-center">
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3, delay: 0.4 }}
								viewport={{ once: true }}
								className="flex h-8 w-8 items-center justify-center rounded-full border border-stroke-soft-200/50 bg-bg-white-0 shadow-sm"
							>
								<Icon name="arrow-down" className="h-4 w-4 text-text-sub-600" />
							</motion.div>
						</div>

						{/* After Card */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.5 }}
							viewport={{ once: true }}
							className="rounded-xl border border-green-200 bg-green-50/30 p-5 shadow-sm"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
										<Icon
											name="mail-check-02"
											className="h-5 w-5 text-green-600"
										/>
									</div>
									<div>
										<p className="font-medium text-sm text-text-strong-950">
											After Verification
										</p>
										<p className="text-text-sub-600 text-xs">
											Optimized delivery
										</p>
									</div>
								</div>
								<div className="text-right">
									<p className="font-bold text-2xl text-green-600">0.2%</p>
									<p className="text-text-sub-600 text-xs">Bounce rate</p>
								</div>
							</div>
							<div className="mt-4">
								<div className="h-2 w-full overflow-hidden rounded-full bg-green-100">
									<motion.div
										initial={{ width: 0 }}
										whileInView={{ width: "2%" }}
										transition={{ duration: 0.8, delay: 0.7 }}
										viewport={{ once: true }}
										className="h-2 rounded-full bg-green-500"
									/>
								</div>
							</div>
						</motion.div>

						{/* Stats row */}
						<motion.div
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ duration: 0.4, delay: 0.8 }}
							viewport={{ once: true }}
							className="grid grid-cols-3 gap-3"
						>
							<div className="rounded-lg border border-stroke-soft-200/50 bg-bg-white-0 p-3 text-center">
								<p className="font-semibold text-lg text-text-strong-950">
									98%
								</p>
								<p className="text-text-sub-600 text-xs">Reduction</p>
							</div>
							<div className="rounded-lg border border-stroke-soft-200/50 bg-bg-white-0 p-3 text-center">
								<p className="font-semibold text-lg text-text-strong-950">
									&lt;50ms
								</p>
								<p className="text-text-sub-600 text-xs">Response</p>
							</div>
							<div className="rounded-lg border border-stroke-soft-200/50 bg-bg-white-0 p-3 text-center">
								<p className="font-semibold text-lg text-text-strong-950">
									99.9%
								</p>
								<p className="text-text-sub-600 text-xs">Accuracy</p>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
};
