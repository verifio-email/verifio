"use client";

import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";

export function AnimatedBrokenOnboarding() {
	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const item = {
		hidden: { opacity: 0, y: 15 },
		show: {
			opacity: 1,
			y: 0,
			transition: { type: "spring", stiffness: 300, damping: 24 },
		},
	};

	return (
		<motion.div
			variants={container}
			initial="hidden"
			whileInView="show"
			viewport={{ once: true, margin: "-50px" }}
			className="flex w-full flex-col pt-8 pb-4"
		>
			<div className="mb-10 text-center">
				<motion.h3
					variants={item}
					className="mb-2 font-bold text-text-strong-950 text-xl tracking-tight"
				>
					The Invisible Drop-off
				</motion.h3>
				<motion.p
					variants={item}
					className="mx-auto max-w-[300px] text-sm text-text-sub-600 leading-relaxed"
				>
					Fake emails and typos quietly destroy your conversion rates before
					users even activate.
				</motion.p>
			</div>

			<div className="relative mx-auto flex w-full max-w-sm flex-col items-center">
				{/* 1. Sign Up */}
				<motion.div
					variants={item}
					className="z-10 flex w-full items-center justify-between rounded-2xl border border-stroke-soft-200 bg-bg-white-0 px-4 py-3.5 shadow-sm transition-shadow hover:shadow-md dark:border-stroke-soft-200/20 dark:bg-gray-800/80"
				>
					<div className="flex items-center gap-3">
						<div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10">
							<Icon
								name="user-check"
								className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400"
							/>
						</div>
						<div className="flex flex-col text-left">
							<span className="font-semibold text-sm text-text-strong-950 leading-tight">
								User Sign Up
							</span>
							<span className="mt-0.5 text-[11px] text-text-sub-600">
								Intent to register
							</span>
						</div>
					</div>
					<div className="flex flex-col items-end">
						<span className="font-bold font-mono text-sm text-text-strong-950">
							100%
						</span>
					</div>
				</motion.div>

				{/* Connecting Line */}
				<motion.div
					variants={item}
					className="relative flex h-14 w-px bg-stroke-soft-200/60 dark:bg-stroke-soft-200/20"
				>
					<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-10 whitespace-nowrap rounded-full border border-stroke-soft-200/50 bg-bg-white-0 px-2 py-0.5 font-medium text-[10px] text-text-sub-600 shadow-sm dark:border-stroke-soft-200/10 dark:bg-[#0A0A0B]">
						Account Created
					</div>
				</motion.div>

				{/* 2. Verification Sent */}
				<motion.div
					variants={item}
					className="z-10 flex w-[90%] items-center justify-between rounded-2xl border border-stroke-soft-200 bg-bg-white-0 px-4 py-3.5 shadow-sm transition-shadow hover:shadow-md dark:border-stroke-soft-200/20 dark:bg-gray-800/80"
				>
					<div className="flex items-center gap-3">
						<div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-500/10">
							<Icon
								name="mail"
								className="h-4.5 w-4.5 text-orange-600 dark:text-orange-400"
							/>
						</div>
						<div className="flex flex-col text-left">
							<span className="font-semibold text-sm text-text-strong-950 leading-tight">
								Verification Email
							</span>
							<span className="mt-0.5 text-[11px] text-text-sub-600">
								System sends email
							</span>
						</div>
					</div>
					<div className="flex flex-col items-end">
						<span className="font-bold font-mono text-orange-600 text-sm">
							85%
						</span>
					</div>
				</motion.div>

				{/* Branching Lines */}
				<motion.div variants={item} className="flex w-full justify-center">
					<div className="relative flex h-[72px] w-[80%]">
						{/* Vertical stem */}
						<div className="-translate-x-1/2 absolute top-0 left-1/2 h-4 w-px bg-stroke-soft-200/60 dark:bg-stroke-soft-200/20" />

						{/* Horizontal crossbar */}
						<div className="absolute top-4 flex w-full">
							<div className="h-px w-1/2 border-stroke-soft-200/60 border-t dark:border-stroke-soft-200/20" />
							<div className="h-px w-1/2 border-red-500/40 border-t border-dashed" />
						</div>

						{/* Left drop (Success) */}
						<div className="absolute top-4 left-0 flex h-[56px] flex-col items-center">
							<div className="h-full w-px bg-stroke-soft-200/60 dark:bg-stroke-soft-200/20" />
						</div>

						{/* Right drop (Failed) */}
						<div className="absolute top-4 right-0 flex h-[56px] flex-col items-center">
							<div className="relative h-full w-px border-red-500/40 border-l border-dashed">
								<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-0 z-10 whitespace-nowrap rounded border border-red-500/20 bg-bg-white-0 px-1.5 py-0.5 font-bold font-mono text-[10px] text-red-500 shadow-sm dark:bg-gray-900">
									-15%
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* 3. Bottom Nodes */}
				<motion.div
					variants={item}
					className="z-10 flex w-full items-stretch justify-between gap-4"
				>
					{/* Success Path */}
					<div className="flex w-1/2 flex-col items-center justify-center rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-4 text-center shadow-sm transition-shadow hover:shadow-md dark:border-stroke-soft-200/20 dark:bg-gray-800/80">
						<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-50 dark:bg-green-500/10">
							<Icon
								name="check"
								className="h-5 w-5 text-green-600 dark:text-green-400"
							/>
						</div>
						<span className="font-semibold text-sm text-text-strong-950">
							Activated
						</span>
						<span className="mt-1 font-bold font-mono text-[11px] text-green-600">
							70% final
						</span>
					</div>

					{/* Failed Path */}
					<div className="flex w-1/2 flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-4 text-center dark:border-red-500/20 dark:bg-red-500/5">
						<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
							<Icon name="user-cross" className="h-5 w-5 text-red-600" />
						</div>
						<span className="font-semibold text-red-700 text-sm dark:text-red-400">
							Hard Bounce
						</span>
						<span className="mt-1 font-bold font-mono text-[11px] text-red-600 opacity-90">
							Never delivered
						</span>
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
}

export default AnimatedBrokenOnboarding;
