"use client";

import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";

export const FraudPrevention = () => {
	return (
		<div className="border-stroke-soft-100 border-b">
			<div className="grid grid-cols-1 lg:grid-cols-2">
				{/* Left Content Section */}
				<div className="flex flex-col justify-center space-y-6 p-10 md:p-16 lg:p-20">
					{/* Label */}
					<div className="flex items-center gap-2">
						<Icon name="shield-check" className="h-4 w-4 text-text-sub-600" />
						<span className="text-text-sub-600 text-sm">
							Prevent fake signups
						</span>
					</div>

					{/* Heading */}
					<h3 className="font-semibold text-3xl text-text-strong-950 tracking-tight md:text-4xl">
						Block fraud at the door
					</h3>

					{/* Description */}
					<p className="max-w-md text-text-sub-600 text-base leading-relaxed">
						Stop bots and fraudsters instantly. Detect disposable emails,
						role-based addresses, and suspicious patterns to keep your platform
						secure.
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
				<div className="flex items-center justify-center border-stroke-soft-100 p-8 md:p-12 lg:border-l lg:p-16">
					<div className="w-full max-w-sm space-y-4">
						{/* Header with status */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
								<span className="font-medium text-sm text-text-sub-600">
									Fraud Detection
								</span>
							</div>
							<span className="text-text-sub-600 text-xs">
								3 threats blocked
							</span>
						</div>

						{/* Blocked email cards */}
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.4 }}
							viewport={{ once: true }}
							className="rounded-xl border border-red-200 bg-red-50/50 p-4 shadow-sm"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
										<Icon name="x-close" className="h-4 w-4 text-red-600" />
									</div>
									<div>
										<p className="font-medium text-sm text-text-strong-950">
											temp123@tempmail.com
										</p>
										<p className="text-red-600 text-xs">Disposable email</p>
									</div>
								</div>
								<span className="rounded-full bg-red-100 px-2 py-0.5 font-medium text-red-700 text-xs">
									Blocked
								</span>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.4, delay: 0.15 }}
							viewport={{ once: true }}
							className="rounded-xl border border-red-200 bg-red-50/50 p-4 shadow-sm"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
										<Icon name="x-close" className="h-4 w-4 text-red-600" />
									</div>
									<div>
										<p className="font-medium text-sm text-text-strong-950">
											abuse@example.com
										</p>
										<p className="text-red-600 text-xs">Role-based address</p>
									</div>
								</div>
								<span className="rounded-full bg-red-100 px-2 py-0.5 font-medium text-red-700 text-xs">
									Blocked
								</span>
							</div>
						</motion.div>

						{/* Verified email card */}
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.4, delay: 0.3 }}
							viewport={{ once: true }}
							className="rounded-xl border border-green-200 bg-green-50/50 p-4 shadow-sm"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
										<Icon
											name="check-circle"
											className="h-4 w-4 text-green-600"
										/>
									</div>
									<div>
										<p className="font-medium text-sm text-text-strong-950">
											john.doe@gmail.com
										</p>
										<p className="text-green-600 text-xs">Valid email</p>
									</div>
								</div>
								<span className="rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700 text-xs">
									Verified
								</span>
							</div>
						</motion.div>

						{/* Stats row */}
						<motion.div
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ duration: 0.4, delay: 0.45 }}
							viewport={{ once: true }}
							className="grid grid-cols-3 gap-3 pt-2"
						>
							<div className="rounded-lg border border-stroke-soft-100 bg-bg-white-0 p-3 text-center">
								<p className="font-semibold text-lg text-text-strong-950">
									99%
								</p>
								<p className="text-text-sub-600 text-xs">Detection</p>
							</div>
							<div className="rounded-lg border border-stroke-soft-100 bg-bg-white-0 p-3 text-center">
								<p className="font-semibold text-lg text-text-strong-950">
									50k+
								</p>
								<p className="text-text-sub-600 text-xs">Domains</p>
							</div>
							<div className="rounded-lg border border-stroke-soft-100 bg-bg-white-0 p-3 text-center">
								<p className="font-semibold text-lg text-text-strong-950">0</p>
								<p className="text-text-sub-600 text-xs">False +</p>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
};
