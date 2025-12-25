"use client";

import * as Button from "@verifio/ui/button";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import * as Input from "@verifio/ui/input";
import * as Select from "@verifio/ui/select";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

type TabType = "single" | "bulk" | "domain";
type FormatType = "json" | "markdown";

interface RecentRun {
	id: string;
	email: string;
	endpoint: string;
	status: "success" | "failed" | "pending";
	timestamp: Date;
}

// Mock recent runs data
const mockRecentRuns: RecentRun[] = [
	{
		id: "1",
		email: "test@example.com",
		endpoint: "Single Verify",
		status: "success",
		timestamp: new Date(),
	},
];

const PlaygroundPage = () => {
	const [activeTab, setActiveTab] = useState<TabType>("single");
	const [email, setEmail] = useState("");
	const [format, setFormat] = useState<FormatType>("json");
	const [isVerifying, setIsVerifying] = useState(false);
	const [recentRuns, setRecentRuns] = useState<RecentRun[]>(mockRecentRuns);

	const tabs = [
		{ id: "single" as TabType, label: "Verify", dots: 3 },
		{ id: "bulk" as TabType, label: "Bulk", dots: 2, badge: "New" },
		{ id: "domain" as TabType, label: "Domain", dots: 2 },
	];

	const handleVerify = async () => {
		if (!email.trim()) {
			toast.error("Please enter an email address");
			return;
		}

		setIsVerifying(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));

		const newRun: RecentRun = {
			id: Date.now().toString(),
			email: email,
			endpoint: tabs.find((t) => t.id === activeTab)?.label || "Verify",
			status: "success",
			timestamp: new Date(),
		};

		setRecentRuns([newRun, ...recentRuns.slice(0, 9)]);
		toast.success("Email verified successfully!");
		setIsVerifying(false);
	};

	const handleGetCode = () => {
		const codeSnippet = `fetch('https://api.verifio.com/v1/verify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email: '${email || "example@email.com"}' })
})`;

		navigator.clipboard.writeText(codeSnippet);
		toast.success("Code copied to clipboard!");
	};

	return (
		<div className="flex-1 overflow-y-auto">
			{/* Header Section */}
			<div className="border-stroke-soft-200 border-b">
				<div className="px-[340px] 2xl:px-[450px]">
					<div className="relative border-stroke-soft-200 border-r border-l pt-24 pb-12 text-center">
						{/* Decorative background pattern */}
						<div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
							<div className="absolute top-1 left-1/3 text-text-disabled-300 text-xl">
								{"{ }"}
							</div>
							<div className="absolute top-8 right-1/9 text-text-disabled-300 text-xl">
								{"< />"}
							</div>
							<div className="absolute right-1/5 bottom-2 text-text-disabled-300 text-xl">
								{"( )"}
							</div>
							<div className="absolute bottom-4 left-1/10 text-text-disabled-300 text-xl">
								{"[ ]"}
							</div>
						</div>

						<h1 className="relative font-semibold text-2xl text-text-strong-950 md:text-3xl">
							Playground
						</h1>
						<p className="relative mt-2 text-text-sub-600">
							API, Docs and Playground - all in one place
						</p>
					</div>
				</div>
			</div>

			{/* Tab Navigation Section */}
			<div className="border-stroke-soft-200 border-b">
				<div className="px-[340px] 2xl:px-[450px]">
					<div className="flex items-center justify-center border-stroke-soft-200 border-r border-l py-6">
						{/* Tab container with gray background */}
						<div className="relative flex items-center gap-1 rounded-xl bg-bg-weak-50 p-0.5">
							{tabs.map((tab) => (
								<button
									key={tab.id}
									type="button"
									onClick={() => setActiveTab(tab.id)}
									className={cn(
										"group relative z-10 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5",
										"transition-colors duration-200 ease-out",
										activeTab === tab.id
											? "text-text-strong-950"
											: "text-text-sub-600 hover:text-text-strong-950",
									)}
								>
									{/* Animated background for active tab */}
									{activeTab === tab.id && (
										<motion.div
											layoutId="activeTabBackground"
											className="absolute inset-0 rounded-lg bg-bg-white-0"
											style={{
												boxShadow:
													"rgba(0, 0, 0, 0.04) 0px 6px 12px -3px, rgba(0, 0, 0, 0.04) 0px 3px 6px -1px, rgba(0, 0, 0, 0.04) 0px 1px 2px 0px, rgba(0, 0, 0, 0.06) 0px 0.5px 0.5px 0px",
											}}
											transition={{
												type: "spring",
												stiffness: 500,
												damping: 35,
											}}
										/>
									)}
									{/* Dot pattern icon */}
									<span
										className={cn(
											"relative z-10 flex items-center gap-[2px] transition-colors duration-200",
											activeTab === tab.id
												? "text-primary-base"
												: "text-text-soft-400 group-hover:text-text-sub-600",
										)}
									>
										{Array.from({ length: tab.dots }).map((_, i) => (
											<span key={i} className="flex flex-col gap-[2px]">
												<span className="h-[3px] w-[3px] rounded-full bg-current" />
												<span className="h-[3px] w-[3px] rounded-full bg-current" />
											</span>
										))}
									</span>
									<span className="label-sm relative z-10">{tab.label}</span>
									{tab.badge && (
										<span className="relative z-10 rounded bg-bg-soft-200 px-1.5 py-0.5 font-medium text-[10px] text-text-sub-600">
											{tab.badge}
										</span>
									)}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Input Section */}
			<div className="border-stroke-soft-200 border-b">
				<div className="px-6 2xl:px-32">
					<div className="border-stroke-soft-200 border-r border-l p-6">
						<div className="mx-auto max-w-3xl">
							<div className="rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-4 shadow-regular-xs">
								{/* Email Input */}
								<div className="mb-4">
									<Input.Root size="medium">
										<Input.Wrapper>
											<Input.InlineAffix>email@</Input.InlineAffix>
											<Input.Input
												placeholder="example.com"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														handleVerify();
													}
												}}
											/>
										</Input.Wrapper>
									</Input.Root>
								</div>

								{/* Action Row */}
								<div className="flex flex-wrap items-center gap-3">
									{/* Left side actions */}
									<div className="flex items-center gap-2">
										<button
											type="button"
											className="flex h-9 w-9 items-center justify-center rounded-lg border border-stroke-soft-200 text-text-sub-600 transition-colors hover:bg-bg-weak-50 hover:text-text-strong-950"
											aria-label="Settings"
										>
											<Icon name="settings" className="h-4 w-4" />
										</button>
										<button
											type="button"
											onClick={() => setEmail("")}
											className="flex h-9 w-9 items-center justify-center rounded-lg border border-stroke-soft-200 text-text-sub-600 transition-colors hover:bg-bg-weak-50 hover:text-text-strong-950"
											aria-label="Clear input"
										>
											<Icon name="trash" className="h-4 w-4" />
										</button>
									</div>

									{/* Format Dropdown */}
									<div className="flex items-center gap-2">
										<Icon
											name="file-text"
											className="h-4 w-4 text-text-sub-600"
										/>
										<Select.Root
											value={format}
											onValueChange={(v) => setFormat(v as FormatType)}
											size="small"
											variant="compact"
										>
											<Select.Trigger className="min-w-[100px]">
												<Select.Value />
											</Select.Trigger>
											<Select.Content>
												<Select.Item value="json">JSON</Select.Item>
												<Select.Item value="markdown">Markdown</Select.Item>
											</Select.Content>
										</Select.Root>
									</div>

									{/* Right side actions */}
									<div className="ml-auto flex items-center gap-2">
										<Button.Root
											variant="neutral"
											mode="stroke"
											size="small"
											onClick={handleGetCode}
										>
											<Button.Icon as={Icon} name="code" />
											Get code
										</Button.Root>
										<Button.Root
											variant="primary"
											mode="filled"
											size="small"
											onClick={handleVerify}
											disabled={isVerifying}
										>
											{isVerifying ? (
												<>
													<Icon
														name="loader"
														className="h-4 w-4 animate-spin"
													/>
													Verifying...
												</>
											) : (
												<>
													<Button.Icon as={Icon} name="play" />
													Start verification
												</>
											)}
										</Button.Root>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Recent Runs Section */}
			<div className="border-stroke-soft-200 border-b">
				<div className="px-6 2xl:px-32">
					<div className="border-stroke-soft-200 border-r border-l p-6">
						<div className="mx-auto max-w-3xl">
							<h2 className="mb-4 font-semibold text-lg text-text-strong-950">
								Recent Runs
							</h2>

							<div className="grid gap-4 md:grid-cols-2">
								{recentRuns.length === 0 ? (
									<div className="col-span-2 flex flex-col items-center justify-center rounded-xl border border-stroke-soft-200 border-dashed bg-bg-weak-50 py-12">
										<Icon
											name="clock"
											className="mb-3 h-8 w-8 text-text-disabled-300"
										/>
										<p className="text-text-sub-600">No recent runs yet</p>
										<p className="text-[13px] text-text-soft-400">
											Start a verification to see results here
										</p>
									</div>
								) : (
									recentRuns.map((run) => (
										<div
											key={run.id}
											className="rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-4 transition-colors hover:bg-bg-weak-50"
										>
											<div className="mb-3 flex items-center gap-3">
												<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-weak-50">
													<Icon
														name="mail"
														className="h-4 w-4 text-text-sub-600"
													/>
												</div>
												<span className="flex-1 truncate font-mono text-sm text-text-strong-950">
													{run.email}
												</span>
												<Icon
													name="external-link"
													className="h-4 w-4 shrink-0 text-text-sub-600"
												/>
											</div>

											<div className="flex items-center justify-between text-[13px]">
												<div className="flex items-center gap-4">
													<div>
														<span className="text-text-soft-400">Endpoint</span>
														<span className="ml-2 text-text-sub-600">
															{run.endpoint}
														</span>
													</div>
												</div>
												<div className="flex items-center gap-2">
													<span className="text-text-soft-400">Status</span>
													<span
														className={cn(
															"flex items-center gap-1",
															run.status === "success"
																? "text-success-base"
																: run.status === "failed"
																	? "text-error-base"
																	: "text-warning-base",
														)}
													>
														<Icon
															name={
																run.status === "success"
																	? "check-circle"
																	: run.status === "failed"
																		? "x-circle"
																		: "clock"
															}
															className="h-3.5 w-3.5"
														/>
														{run.status.charAt(0).toUpperCase() +
															run.status.slice(1)}
													</span>
												</div>
											</div>
										</div>
									))
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PlaygroundPage;
