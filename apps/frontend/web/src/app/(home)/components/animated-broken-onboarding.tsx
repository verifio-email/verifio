"use client";

import { Icon } from "@verifio/ui/icon";

export function AnimatedBrokenOnboarding() {
	return (
		<div className="flex w-full flex-col pt-4">
			<div className="relative mx-auto flex w-full max-w-sm flex-col items-center">
				{/* Top Node */}
				<div className="z-10 flex w-full items-center justify-between rounded-2xl border border-stroke-soft-200/50 bg-bg-white-0 px-4 py-3 shadow-sm dark:bg-gray-800/80">
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
							<Icon name="user-check" className="h-4 w-4 text-blue-500" />
						</div>
						<span className="font-medium text-sm text-text-strong-950">
							User Signed Up
						</span>
					</div>
					<span className="font-medium font-mono text-text-sub-600 text-xs">
						100%
					</span>
				</div>

				{/* Connecting Line */}
				<div className="h-6 w-px bg-stroke-soft-200/50" />

				{/* Verification Split Node */}
				<div className="z-10 flex w-[90%] items-center justify-between rounded-2xl border border-stroke-soft-200/50 bg-bg-white-0 px-4 py-3 shadow-sm dark:bg-gray-800/80">
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50">
							<Icon name="mail" className="h-4 w-4 text-orange-500" />
						</div>
						<span className="font-medium text-sm text-text-strong-950">
							Verification Sent
						</span>
					</div>
					<span className="font-medium font-mono text-text-sub-600 text-xs">
						85%
					</span>
				</div>

				{/* Two Connecting Lines (Split Path) */}
				<div className="flex w-[80%] justify-between">
					{/* Left Path: Success */}
					<div className="flex flex-col items-center">
						<div className="h-6 w-px bg-stroke-soft-200/50" />
					</div>
					{/* Right Path: Failed */}
					<div className="flex flex-col items-center">
						<div className="h-6 w-px bg-red-500/30" />
					</div>
				</div>

				{/* Bottom Nodes */}
				<div className="z-10 flex w-full items-center justify-between gap-4">
					<div className="flex w-1/2 flex-col items-center justify-center rounded-2xl border border-stroke-soft-200/50 bg-bg-white-0 p-3 text-center shadow-sm dark:bg-gray-800/80">
						<div className="mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-50">
							<Icon name="check" className="h-3 w-3 text-green-500" />
						</div>
						<span className="font-medium text-text-strong-950 text-xs">
							Activated
						</span>
					</div>

					<div className="flex w-1/2 flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-50 p-3 text-center dark:bg-red-500/5">
						<div className="mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
							<Icon name="user-cross" className="h-3 w-3 text-red-500" />
						</div>
						<span className="font-medium text-red-600 text-xs">
							Bounced / Dropped
						</span>
					</div>
				</div>
			</div>

			<div className="mt-8 rounded-xl bg-blue-50/50 px-4 py-3 text-center dark:bg-blue-500/5">
				<p className="text-blue-600/80 text-xs">
					Failed verifications cause a 15% drop-off in user activation.
				</p>
			</div>
		</div>
	);
}

export default AnimatedBrokenOnboarding;
