"use client";

import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";

export function EmailCounter() {
	const [emailCount, setEmailCount] = useState(400000);

	useEffect(() => {
		const interval = setInterval(() => {
			setEmailCount((prev) => prev + 2);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex flex-col items-center justify-center md:items-end">
			<div className="flex flex-col items-center gap-2 md:items-end">
				<div className="flex items-center gap-3">
					<span className="relative flex h-3 w-3">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
						<span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
					</span>
					<NumberFlow
						value={emailCount}
						format={{ useGrouping: true }}
						className="font-bold text-5xl text-text-strong-950 tabular-nums tracking-tight md:text-6xl lg:text-7xl"
					/>
				</div>
				<p className="text-sm text-text-sub-600">Emails verified till today</p>
			</div>
		</div>
	);
}

export default EmailCounter;
