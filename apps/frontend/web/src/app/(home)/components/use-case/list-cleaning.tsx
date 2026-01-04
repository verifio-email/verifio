"use client";

import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";

export const ListCleaning = () => {
	return (
		<div className="border-stroke-soft-100 border-b">
			<div className="grid grid-cols-1 lg:grid-cols-2">
				{/* Left Content Section */}
				<div className="flex flex-col justify-center space-y-6 p-10 md:p-16 lg:p-20">
					{/* Label */}
					<div className="flex items-center gap-2">
						<Icon name="file-02" className="h-4 w-4 text-text-sub-600" />
						<span className="text-text-sub-600 text-sm">Bulk verification</span>
					</div>

					{/* Heading */}
					<h3 className="font-semibold text-3xl text-text-strong-950 tracking-tight md:text-4xl">
						Clean lists instantly
					</h3>

					{/* Description */}
					<p className="max-w-md text-text-sub-600 text-base leading-relaxed">
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
				<div className="flex items-center justify-center border-stroke-soft-100 p-8 md:p-12 lg:border-l lg:p-16">
					<div className="w-full max-w-sm space-y-5">
						{/* Header with status */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
								<span className="font-medium text-sm text-text-sub-600">
									List Analysis
								</span>
							</div>
							<span className="text-text-sub-600 text-xs">
								Processing complete
							</span>
						</div>

						{/* Main list health card */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4 }}
							viewport={{ once: true }}
							className="rounded-xl border border-stroke-soft-100 bg-bg-white-0 p-5 shadow-sm"
						>
							<div className="mb-5 flex items-center justify-between">
								<h4 className="font-semibold text-text-strong-950">
									Email List Health
								</h4>
								<div className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1">
									<div className="h-1.5 w-1.5 rounded-full bg-green-500" />
									<span className="font-medium text-green-700 text-xs">
										94.5% Clean
									</span>
								</div>
							</div>

							{/* Stats grid */}
							<div className="mb-4 grid grid-cols-2 gap-3">
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									whileInView={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.3, delay: 0.2 }}
									viewport={{ once: true }}
									className="rounded-lg bg-bg-weak-50 p-3"
								>
									<p className="mb-1 text-text-sub-600 text-xs">Total Emails</p>
									<p className="font-semibold text-xl text-text-strong-950">
										50,000
									</p>
								</motion.div>
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									whileInView={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.3, delay: 0.3 }}
									viewport={{ once: true }}
									className="rounded-lg bg-green-50 p-3"
								>
									<p className="mb-1 text-green-700 text-xs">Valid</p>
									<p className="font-semibold text-xl text-green-700">47,250</p>
								</motion.div>
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									whileInView={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.3, delay: 0.4 }}
									viewport={{ once: true }}
									className="rounded-lg bg-red-50 p-3"
								>
									<p className="mb-1 text-red-700 text-xs">Invalid</p>
									<p className="font-semibold text-xl text-red-700">2,100</p>
								</motion.div>
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									whileInView={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.3, delay: 0.5 }}
									viewport={{ once: true }}
									className="rounded-lg bg-yellow-50 p-3"
								>
									<p className="mb-1 text-yellow-700 text-xs">Risky</p>
									<p className="font-semibold text-xl text-yellow-700">650</p>
								</motion.div>
							</div>

							{/* Quality bar */}
							<motion.div
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								transition={{ duration: 0.3, delay: 0.6 }}
								viewport={{ once: true }}
								className="rounded-lg bg-green-50 p-3"
							>
								<div className="mb-2 flex items-center justify-between">
									<span className="font-medium text-green-900 text-sm">
										List Quality
									</span>
									<span className="font-semibold text-green-700 text-lg">
										94.5%
									</span>
								</div>
								<div className="h-2 w-full overflow-hidden rounded-full bg-green-100">
									<motion.div
										initial={{ width: 0 }}
										whileInView={{ width: "94.5%" }}
										transition={{ duration: 0.8, delay: 0.7 }}
										viewport={{ once: true }}
										className="h-2 rounded-full bg-green-500"
									/>
								</div>
							</motion.div>
						</motion.div>

						{/* Bottom stats */}
						<motion.div
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ duration: 0.4, delay: 0.8 }}
							viewport={{ once: true }}
							className="grid grid-cols-2 gap-3"
						>
							<div className="rounded-lg border border-stroke-soft-100 bg-bg-white-0 p-3 text-center">
								<p className="font-semibold text-lg text-text-strong-950">1M</p>
								<p className="text-text-sub-600 text-xs">Max per batch</p>
							</div>
							<div className="rounded-lg border border-stroke-soft-100 bg-bg-white-0 p-3 text-center">
								<p className="font-semibold text-lg text-text-strong-950">
									&lt;1min
								</p>
								<p className="text-text-sub-600 text-xs">Processing time</p>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
};
