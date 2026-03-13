"use client";

const flaggedEmails = [
	{
		email: "john.admin@spamhaus.org",
		status: "Spam Trap",
		time: "just now",
		color: "bg-purple-100 text-purple-600",
	},
	{
		email: "disposable@temp-mail.io",
		status: "Disposable",
		time: "2m",
		color: "bg-red-100 text-red-600",
	},
	{
		email: "info@company.com",
		status: "Role-Based",
		time: "15m",
		color: "bg-orange-100 text-orange-600",
	},
	{
		email: "support@startup.co",
		status: "Role-Based",
		time: "1h",
		color: "bg-orange-100 text-orange-600",
	},
	{
		email: "support@startup.co",
		status: "Role-Based",
		time: "1h",
		color: "bg-orange-100 text-orange-600",
	},
	{
		email: "bot_12399@guerrilla.com",
		status: "Disposable",
		time: "3h",
		color: "bg-red-100 text-red-600",
	},
];

export function AnimatedSpamFlag() {
	return (
		<div className="flex w-full flex-col border-stroke-soft-100/60 border-t dark:border-stroke-soft-100/40">
			{/* List */}
			<div className="flex flex-col">
				{flaggedEmails.map((item, i) => (
					<div
						key={i}
						className={`group flex items-center justify-between p-3 transition-colors hover:bg-bg-white-0 dark:hover:bg-gray-800/50 ${
							i !== flaggedEmails.length - 1
								? "border-stroke-soft-100/60 border-b dark:border-stroke-soft-100/40"
								: ""
						}`}
					>
						{/* Email Info */}
						<div className="flex flex-1 items-center gap-3">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stroke-soft-200/30">
								<span className="font-semibold text-text-sub-600 text-xs uppercase">
									{item.email.charAt(0)}
								</span>
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

						{/* Badge & Time */}
						<div className="flex w-24 shrink-0 items-center justify-end gap-3 md:w-32">
							<span
								className={`rounded-full px-2.5 py-1 font-medium text-[11px] ${item.color}`}
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
