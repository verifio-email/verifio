"use client";

import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";

export const BounceReduction = () => {
	return (
		<div className="border-stroke-soft-200/50 border-b">
			<div className="grid grid-cols-1 lg:grid-cols-2">
				{/* Left Content Section */}
				<div className="flex flex-col justify-center space-y-6 border-stroke-soft-200/50 p-10 md:p-16 lg:border-r lg:p-20">
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
				</div>

				{/* Right Visual Section */}
				<div className="flex flex-col">
					{/* Status Header */}
					<div className="flex items-center justify-between border-stroke-soft-200/50 border-b bg-bg-white-0 px-6 py-3">
						<div className="flex items-center gap-2">
							<div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
							<span className="font-mono text-[10px] uppercase tracking-wider text-text-sub-600">
								Live Verification
							</span>
						</div>
						<span className="font-mono text-[10px] uppercase tracking-wider text-text-sub-600">
							[SYSTEM ACTIVE]
						</span>
					</div>

					{/* Visual Grid */}
					<div className="flex-1 bg-bg-white-0 p-8 md:p-12">
						<div className="relative mx-auto max-w-sm">
							<div className="grid gap-0 border border-stroke-soft-200/50">
								{/* Before State */}
								<div className="border-stroke-soft-200/50 border-b bg-red-50/10 p-6">
									<div className="mb-4 flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="flex h-8 w-8 items-center justify-center border border-red-200 bg-red-50 text-red-600">
												<Icon name="mail-open-02" className="h-4 w-4" />
											</div>
											<div>
												<p className="font-mono text-xs font-medium text-text-strong-950 uppercase">
													Before
												</p>
												<p className="text-[10px] text-red-600 uppercase tracking-wide">
													High Failure Rate
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="font-bold text-xl text-red-600 tabular-nums">
												12.3%
											</p>
										</div>
									</div>
									<div className="h-1.5 w-full overflow-hidden bg-stroke-soft-200/50">
										<motion.div
											initial={{ width: 0 }}
											whileInView={{ width: "12.3%" }}
											transition={{ duration: 0.8, delay: 0.2 }}
											viewport={{ once: true }}
											className="h-full bg-red-500"
										/>
									</div>
								</div>

								{/* Transition Indicator */}
								<div className="relative z-10 -my-3 flex justify-center">
									<motion.div
										initial={{ opacity: 0, scale: 0.8 }}
										whileInView={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.3, delay: 0.4 }}
										viewport={{ once: true }}
										className="flex h-6 w-6 items-center justify-center border border-stroke-soft-200 bg-bg-white-0"
									>
										<Icon
											name="arrow-down"
											className="h-3 w-3 text-text-sub-600"
										/>
									</motion.div>
								</div>

								{/* After State */}
								<div className="bg-green-50/10 p-6">
									<div className="mb-4 flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="flex h-8 w-8 items-center justify-center border border-green-200 bg-green-50 text-green-600">
												<Icon name="mail-check-02" className="h-4 w-4" />
											</div>
											<div>
												<p className="font-mono text-xs font-medium text-text-strong-950 uppercase">
													After
												</p>
												<p className="text-[10px] text-green-600 uppercase tracking-wide">
													Optimized
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="font-bold text-xl text-green-600 tabular-nums">
												0.2%
											</p>
										</div>
									</div>
									<div className="h-1.5 w-full overflow-hidden bg-stroke-soft-200/50">
										<motion.div
											initial={{ width: 0 }}
											whileInView={{ width: "2%" }}
											transition={{ duration: 0.8, delay: 0.7 }}
											viewport={{ once: true }}
											className="h-full bg-green-500"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Stats Footer */}
					<div className="grid grid-cols-3 border-stroke-soft-200/50 border-t">
						<div className="border-stroke-soft-200/50 border-r p-4 text-center">
							<p className="mb-1 font-bold text-lg text-text-strong-950 tabular-nums">
								98%
							</p>
							<p className="font-mono text-[10px] text-text-sub-600 uppercase tracking-wide">
								Reduction
							</p>
						</div>
						<div className="border-stroke-soft-200/50 border-r p-4 text-center">
							<p className="mb-1 font-bold text-lg text-text-strong-950 tabular-nums">
								&lt;50ms
							</p>
							<p className="font-mono text-[10px] text-text-sub-600 uppercase tracking-wide">
								Latency
							</p>
						</div>
						<div className="p-4 text-center">
							<p className="mb-1 font-bold text-lg text-text-strong-950 tabular-nums">
								99.9%
							</p>
							<p className="font-mono text-[10px] text-text-sub-600 uppercase tracking-wide">
								Accuracy
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
