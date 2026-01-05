"use client";

import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";

export const FraudPrevention = () => {
	return (
		<div className="border-stroke-soft-200/50 border-b">
			<div className="grid grid-cols-1 lg:grid-cols-2">
				{/* Left Content Section */}
				<div className="flex flex-col justify-center space-y-6 border-stroke-soft-200/50 p-10 md:p-16 lg:border-r lg:p-20">
					{/* Label */}
					<div className="flex items-center gap-2">
						<Icon name="shield-check" className="h-4 w-4 text-text-sub-600" />
						<span className="text-sm text-text-sub-600">
							Prevent fake signups
						</span>
					</div>

					{/* Heading */}
					<h3 className="font-semibold text-3xl text-text-strong-950 tracking-tight md:text-4xl">
						Block fraud at the door
					</h3>

					{/* Description */}
					<p className="max-w-md text-base text-text-sub-600 leading-relaxed">
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
				<div className="flex flex-col">
					{/* Header */}
					<div className="flex items-center justify-between border-stroke-soft-200/50 border-b bg-bg-white-0 px-6 py-3">
						<div className="flex items-center gap-2">
							<div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
							<span className="font-mono text-[10px] uppercase tracking-wider text-text-sub-600">
								Fraud Detection
							</span>
						</div>
						<span className="font-mono text-[10px] uppercase tracking-wider text-text-sub-600">
							[3 THREATS BLOCKED]
						</span>
					</div>

					{/* Visual Grid */}
					<div className="flex-1 bg-bg-white-0 p-8 md:p-12">
						<div className="relative mx-auto max-w-sm">
							<div className="grid gap-0 border border-stroke-soft-200/50">
								{/* Blocked 1 */}
								<motion.div
									initial={{ opacity: 0, x: 20 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.4 }}
									viewport={{ once: true }}
									className="flex items-center justify-between border-stroke-soft-200/50 border-b bg-red-50/10 p-4"
								>
									<div className="flex items-center gap-3">
										<Icon name="x-close" className="h-4 w-4 text-red-600" />
										<div>
											<p className="font-mono text-[10px] text-text-strong-950">
												temp123@tempmail.com
											</p>
											<p className="text-[10px] text-red-600 uppercase tracking-wide">
												Disposable
											</p>
										</div>
									</div>
									<div className="rounded-sm border border-red-200 bg-red-50 px-1.5 py-0.5 font-mono text-[10px] text-red-700 uppercase">
										Blocked
									</div>
								</motion.div>

								{/* Blocked 2 */}
								<motion.div
									initial={{ opacity: 0, x: 20 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.4, delay: 0.15 }}
									viewport={{ once: true }}
									className="flex items-center justify-between border-stroke-soft-200/50 border-b bg-red-50/10 p-4"
								>
									<div className="flex items-center gap-3">
										<Icon name="x-close" className="h-4 w-4 text-red-600" />
										<div>
											<p className="font-mono text-[10px] text-text-strong-950">
												abuse@example.com
											</p>
											<p className="text-[10px] text-red-600 uppercase tracking-wide">
												Role-based
											</p>
										</div>
									</div>
									<div className="rounded-sm border border-red-200 bg-red-50 px-1.5 py-0.5 font-mono text-[10px] text-red-700 uppercase">
										Blocked
									</div>
								</motion.div>

								{/* Verified */}
								<motion.div
									initial={{ opacity: 0, x: 20 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.4, delay: 0.3 }}
									viewport={{ once: true }}
									className="flex items-center justify-between p-4 bg-green-50/10"
								>
									<div className="flex items-center gap-3">
										<Icon
											name="check-circle"
											className="h-4 w-4 text-green-600"
										/>
										<div>
											<p className="font-mono text-[10px] text-text-strong-950">
												john.doe@gmail.com
											</p>
											<p className="text-[10px] text-green-600 uppercase tracking-wide">
												Valid Email
											</p>
										</div>
									</div>
									<div className="rounded-sm border border-green-200 bg-green-50 px-1.5 py-0.5 font-mono text-[10px] text-green-700 uppercase">
										Verified
									</div>
								</motion.div>
							</div>
						</div>
					</div>

					{/* Footer Stats */}
					<div className="grid grid-cols-3 border-stroke-soft-200/50 border-t">
						<div className="border-stroke-soft-200/50 border-r p-4 text-center">
							<p className="mb-1 font-bold text-lg text-text-strong-950 tabular-nums">
								99%
							</p>
							<p className="font-mono text-[10px] text-text-sub-600 uppercase tracking-wide">
								Detection
							</p>
						</div>
						<div className="border-stroke-soft-200/50 border-r p-4 text-center">
							<p className="mb-1 font-bold text-lg text-text-strong-950 tabular-nums">
								50k+
							</p>
							<p className="font-mono text-[10px] text-text-sub-600 uppercase tracking-wide">
								Domains
							</p>
						</div>
						<div className="p-4 text-center">
							<p className="mb-1 font-bold text-lg text-text-strong-950 tabular-nums">
								0
							</p>
							<p className="font-mono text-[10px] text-text-sub-600 uppercase tracking-wide">
								False +
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
