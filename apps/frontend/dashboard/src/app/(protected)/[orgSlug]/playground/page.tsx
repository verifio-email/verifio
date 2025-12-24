"use client";

import { Icon } from "@verifio/ui/icon";

const PlaygroundPage = () => {
	return (
		<div className="flex-1 overflow-y-auto p-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="font-semibold text-2xl text-text-strong-950">
					Playground
				</h1>
				<p className="mt-1 text-text-sub-600">
					Test email verification in real-time
				</p>
			</div>

			{/* Content Placeholder */}
			<div className="flex flex-col items-center justify-center rounded-xl border border-stroke-soft-200 border-dashed bg-bg-weak-50 py-16">
				<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-alpha-10">
					<Icon name="play" className="h-8 w-8 text-primary-base" />
				</div>
				<h2 className="mb-2 font-medium text-lg text-text-strong-950">
					Email Verification Playground
				</h2>
				<p className="max-w-md text-center text-text-sub-600">
					Enter an email address to verify it in real-time using your API.
					Perfect for testing and debugging.
				</p>
			</div>
		</div>
	);
};

export default PlaygroundPage;
