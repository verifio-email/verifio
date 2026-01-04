"use client";

import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";

export const DeliverabilityProtection = () => {
	return (
		<div className="border-stroke-soft-200/50 border-b">
			<div className="grid grid-cols-1 lg:grid-cols-2">
				{/* Left Content Section */}
				<div className="flex flex-col justify-center space-y-6 p-10 md:p-16 lg:p-20">
					{/* Label */}
					<div className="flex items-center gap-2">
						<Icon name="verified" className="h-4 w-4 text-text-sub-600" />
						<span className="text-text-sub-600 text-sm">
							Protect deliverability
						</span>
					</div>

					{/* Heading */}
					<h3 className="font-semibold text-3xl text-text-strong-950 tracking-tight md:text-4xl">
						Guard your reputation
					</h3>

					{/* Description */}
					<p className="max-w-md text-text-sub-600 text-base leading-relaxed">
						High bounce rates damage your sender reputation and land emails in
						spam. Maintain a clean sender score by filtering invalid addresses.
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
					<div className="w-full max-w-sm space-y-5">
						{/* Header with status */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
								<span className="font-medium text-sm text-text-sub-600">
									Reputation Monitor
								</span>
							</div>
							<span className="text-text-sub-600 text-xs">Live tracking</span>
						</div>

						{/* Main reputation card */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4 }}
							viewport={{ once: true }}
							className="rounded-xl border border-stroke-soft-200/50 bg-bg-white-0 p-5 shadow-sm"
						>
							<div className="mb-5 flex items-center justify-between">
								<h4 className="font-semibold text-text-strong-950">
									Sender Reputation
								</h4>
								<div className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1">
									<div className="h-1.5 w-1.5 rounded-full bg-green-500" />
									<span className="font-medium text-green-700 text-xs">
										Excellent
									</span>
								</div>
							</div>

							{/* Reputation metrics */}
							<div className="space-y-4">
								<motion.div
									initial={{ opacity: 0 }}
									whileInView={{ opacity: 1 }}
									transition={{ duration: 0.3, delay: 0.2 }}
									viewport={{ once: true }}
								>
									<div className="mb-2 flex items-center justify-between">
										<span className="text-sm text-text-sub-600">
											Domain Reputation
										</span>
										<span className="font-semibold text-sm text-green-600">
											95%
										</span>
									</div>
									<div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
										<motion.div
											initial={{ width: 0 }}
											whileInView={{ width: "95%" }}
											transition={{ duration: 0.8, delay: 0.3 }}
											viewport={{ once: true }}
											className="h-2 rounded-full bg-green-500"
										/>
									</div>
								</motion.div>

								<motion.div
									initial={{ opacity: 0 }}
									whileInView={{ opacity: 1 }}
									transition={{ duration: 0.3, delay: 0.4 }}
									viewport={{ once: true }}
								>
									<div className="mb-2 flex items-center justify-between">
										<span className="text-sm text-text-sub-600">
											IP Reputation
										</span>
										<span className="font-semibold text-sm text-green-600">
											92%
										</span>
									</div>
									<div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
										<motion.div
											initial={{ width: 0 }}
											whileInView={{ width: "92%" }}
											transition={{ duration: 0.8, delay: 0.5 }}
											viewport={{ once: true }}
											className="h-2 rounded-full bg-green-500"
										/>
									</div>
								</motion.div>

								<motion.div
									initial={{ opacity: 0 }}
									whileInView={{ opacity: 1 }}
									transition={{ duration: 0.3, delay: 0.6 }}
									viewport={{ once: true }}
								>
									<div className="mb-2 flex items-center justify-between">
										<span className="text-sm text-text-sub-600">
											Spam Score
										</span>
										<span className="font-semibold text-sm text-green-600">
											Low
										</span>
									</div>
									<div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
										<motion.div
											initial={{ width: 0 }}
											whileInView={{ width: "8%" }}
											transition={{ duration: 0.8, delay: 0.7 }}
											viewport={{ once: true }}
											className="h-2 rounded-full bg-green-500"
										/>
									</div>
								</motion.div>
							</div>
						</motion.div>

						{/* Bottom stats */}
						<motion.div
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ duration: 0.4, delay: 0.8 }}
							viewport={{ once: true }}
							className="grid grid-cols-2 gap-3"
						>
							<div className="rounded-lg border border-stroke-soft-200/50 bg-bg-white-0 p-3 text-center">
								<p className="font-semibold text-lg text-text-strong-950">
									99.2%
								</p>
								<p className="text-text-sub-600 text-xs">Inbox Placement</p>
							</div>
							<div className="rounded-lg border border-stroke-soft-200/50 bg-bg-white-0 p-3 text-center">
								<p className="font-semibold text-lg text-text-strong-950">0</p>
								<p className="text-text-sub-600 text-xs">Blacklist Entries</p>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
};
