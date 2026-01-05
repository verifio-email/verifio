"use client";

import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";

export const ListCleaning = () => {
	return (
		<div className="border-stroke-soft-200/50 border-b">
			<div className="grid grid-cols-1 lg:grid-cols-2">
				{/* Left Content Section */}
				<div className="flex flex-col justify-center space-y-6 border-stroke-soft-200/50 p-10 md:p-16 lg:border-r lg:p-20">
					{/* Label */}
					<div className="flex items-center gap-2">
						<Icon name="file-02" className="h-4 w-4 text-text-sub-600" />
						<span className="text-sm text-text-sub-600">Bulk verification</span>
					</div>

					{/* Heading */}
					<h3 className="font-semibold text-3xl text-text-strong-950 tracking-tight md:text-4xl">
						Clean lists instantly
					</h3>

					{/* Description */}
					<p className="max-w-md text-base text-text-sub-600 leading-relaxed">
						Upload and verify thousands of emails in seconds. Get detailed
						reports on list quality and remove invalid contacts to boost
						campaign performance.
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
							<div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
							<span className="font-mono text-[10px] uppercase tracking-wider text-text-sub-600">
								List Analysis
							</span>
						</div>
						<span className="font-mono text-[10px] uppercase tracking-wider text-text-sub-600">
							[PROCESSING COMPLETE]
						</span>
					</div>

					{/* Visual Grid */}
					<div className="flex-1 bg-bg-white-0 p-8 md:p-12">
						<div className="relative mx-auto max-w-sm">
							<div className="grid gap-0 border border-stroke-soft-200/50">
								{/* Overall Quality */}
								<div className="border-stroke-soft-200/50 border-b bg-bg-white-0 p-4">
									<div className="flex items-center justify-between">
										<span className="font-mono text-xs font-medium text-text-strong-950 uppercase">
											Efficiency Score
										</span>
										<div className="flex items-center gap-2">
											<div className="h-1.5 w-1.5 rounded-full bg-green-500" />
											<span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">
												94.5% Clean
											</span>
										</div>
									</div>
									<div className="mt-3 h-1.5 w-full overflow-hidden bg-stroke-soft-200/50">
										<motion.div
											initial={{ width: 0 }}
											whileInView={{ width: "94.5%" }}
											transition={{ duration: 0.8, delay: 0.2 }}
											viewport={{ once: true }}
											className="h-full bg-green-500"
										/>
									</div>
								</div>

								{/* Stats Grid */}
								<div className="grid grid-cols-2">
									<motion.div
										initial={{ opacity: 0 }}
										whileInView={{ opacity: 1 }}
										transition={{ duration: 0.3, delay: 0.3 }}
										viewport={{ once: true }}
										className="border-stroke-soft-200/50 border-r border-b p-4 text-center"
									>
										<p className="mb-1 font-bold text-lg text-text-strong-950 tabular-nums">
											50,000
										</p>
										<p className="font-mono text-[10px] text-text-sub-600 uppercase tracking-wide">
											Total Emails
										</p>
									</motion.div>
									<motion.div
										initial={{ opacity: 0 }}
										whileInView={{ opacity: 1 }}
										transition={{ duration: 0.3, delay: 0.4 }}
										viewport={{ once: true }}
										className="border-stroke-soft-200/50 border-b p-4 text-center"
									>
										<p className="mb-1 font-bold text-lg text-green-600 tabular-nums">
											47,250
										</p>
										<p className="font-mono text-[10px] text-green-600 uppercase tracking-wide">
											Valid
										</p>
									</motion.div>
									<motion.div
										initial={{ opacity: 0 }}
										whileInView={{ opacity: 1 }}
										transition={{ duration: 0.3, delay: 0.5 }}
										viewport={{ once: true }}
										className="border-stroke-soft-200/50 border-r p-4 text-center"
									>
										<p className="mb-1 font-bold text-lg text-red-600 tabular-nums">
											2,100
										</p>
										<p className="font-mono text-[10px] text-red-600 uppercase tracking-wide">
											Invalid
										</p>
									</motion.div>
									<motion.div
										initial={{ opacity: 0 }}
										whileInView={{ opacity: 1 }}
										transition={{ duration: 0.3, delay: 0.6 }}
										viewport={{ once: true }}
										className="p-4 text-center"
									>
										<p className="mb-1 font-bold text-lg text-yellow-600 tabular-nums">
											650
										</p>
										<p className="font-mono text-[10px] text-yellow-600 uppercase tracking-wide">
											Risky
										</p>
									</motion.div>
								</div>
							</div>
						</div>
					</div>

					{/* Footer Stats */}
					<div className="grid grid-cols-2 border-stroke-soft-200/50 border-t">
						<div className="border-stroke-soft-200/50 border-r p-4 text-center">
							<p className="mb-1 font-bold text-lg text-text-strong-950 tabular-nums">
								1M
							</p>
							<p className="font-mono text-[10px] text-text-sub-600 uppercase tracking-wide">
								Max Per Batch
							</p>
						</div>
						<div className="p-4 text-center">
							<p className="mb-1 font-bold text-lg text-text-strong-950 tabular-nums">
								&lt;1min
							</p>
							<p className="font-mono text-[10px] text-text-sub-600 uppercase tracking-wide">
								Processing Time
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
