"use client";

import NumberFlow from "@number-flow/react";
import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
export function FinalCTA() {
	const [emailCount, setEmailCount] = useState(400000);

	useEffect(() => {
		const interval = setInterval(() => {
			setEmailCount((prev) => prev + 2);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="border-stroke-soft-100 border-b border-t">
			<div className="mx-auto max-w-5xl border-stroke-soft-100 border-l border-r">
				<div className="grid min-h-[280px] grid-cols-1 items-center gap-8 px-6 py-12 md:grid-cols-2 md:px-10 md:py-16">
					{/* Left Content */}
					<motion.div
						className="flex flex-col"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h2 className="text-2xl font-semibold leading-tight text-text-strong-950 md:text-3xl lg:text-4xl">
							Stop trusting black-box
							<br />
							email verification
						</h2>
						<p className="mt-4 text-base text-text-sub-600 md:text-lg">
							Start verifying emails with full transparency and control.
						</p>

						{/* CTA Buttons */}
						<div className="mt-8 flex flex-wrap items-center gap-3">
							<Link href="/signup">
								<Button.Root
									mode="filled"
									variant="primary"
									size="medium"
									className="rounded-full"
								>
									🚀 Try Free (No Credit Card)
								</Button.Root>
							</Link>
							<Link
								href="https://github.com/reloop-labs/verifio"
								target="_blank"
								rel="noopener"
							>
								<Button.Root
									mode="stroke"
									variant="neutral"
									size="medium"
									className="rounded-full"
								>
									<Icon name="github" className="h-4 w-4" />
									Star on GitHub
								</Button.Root>
							</Link>
						</div>
					</motion.div>

					{/* Right - Large Animated Counter */}
					<motion.div
						className="flex flex-col items-center justify-center md:items-end"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<div className="flex flex-col items-center gap-2 md:items-end">
							<div className="flex items-center gap-3">
								<span className="relative flex h-3 w-3">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
									<span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
								</span>
								<NumberFlow
									value={emailCount}
									format={{ useGrouping: true }}
									className="text-5xl font-bold tabular-nums tracking-tight text-text-strong-950 md:text-6xl lg:text-7xl"
								/>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}

export default FinalCTA;
