"use client";

import { Icon } from "@verifio/ui/icon";

const flaggedEmails = [
	{
		email: "john.admin@spamhaus.org",
		source: "Direct",
		status: "Spam Trap",
		time: "just now",
		color: "bg-purple-100 text-purple-600",
	},
	{
		email: "disposable@temp-mail.io",
		source: "Google",
		status: "Disposable",
		time: "2m",
		color: "bg-red-100 text-red-600",
	},
	{
		email: "info@company.com",
		source: "Twitter",
		status: "Role-Based",
		time: "15m",
		color: "bg-orange-100 text-orange-600",
	},
	{
		email: "support@startup.co",
		source: "LinkedIn",
		status: "Role-Based",
		time: "1h",
		color: "bg-orange-100 text-orange-600",
	},
	{
		email: "bot_12399@guerrilla.com",
		source: "Reddit",
		status: "Disposable",
		time: "3h",
		color: "bg-red-100 text-red-600",
	},
];

export function AnimatedSpamFlag() {
	return (
		<div className="flex w-full flex-col pt-2">
			{/* Header */}
			<div className="mb-4 flex items-center justify-between font-medium text-text-sub-600 text-xs">
				<span>FLAGGED SIGNUPS</span>
				<span>SOURCE</span>
				<span>STATUS</span>
			</div>

			{/* List */}
			<div className="flex flex-col gap-3">
				{flaggedEmails.map((item, i) => (
					<div
						key={i}
						className="group flex items-center justify-between rounded-xl border border-transparent p-2 transition-colors hover:border-stroke-soft-200/50 hover:bg-bg-white-0 dark:hover:bg-gray-800/50"
					>
						{/* Email Info */}
						<div className="flex flex-1 items-center gap-3">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stroke-soft-200/30">
								<Icon name="user-cross" className="h-4 w-4 text-text-sub-600" />
							</div>
							<div className="flex flex-col">
								<span className="max-w-[120px] truncate font-medium text-sm text-text-strong-950 md:max-w-[160px]">
									{item.email}
								</span>
								<span className="text-text-sub-600 text-xs">
									{item.time} ago
								</span>
							</div>
						</div>

						{/* Source */}
						<div className="hidden flex-1 items-center gap-1.5 md:flex">
							<Icon
								name="link-external-01"
								className="h-3 w-3 text-text-sub-600"
							/>
							<span className="text-text-sub-600 text-xs">{item.source}</span>
						</div>

						{/* Badge & Time */}
						<div className="flex w-24 shrink-0 items-center justify-end gap-3 md:w-32">
							<span
								className={`rounded-full px-2 py-0.5 font-medium text-[10px] ${item.color}`}
							>
								{item.status}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default AnimatedSpamFlag;
