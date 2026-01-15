"use client";

import { cn } from "@fe/docs/lib/cn";
import { Check, Clipboard } from "lucide-react";
import { useState } from "react";

interface CopyButtonProps {
	value: string;
	className?: string;
}

export function CopyButton({ value, className }: CopyButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(value);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			className={cn(
				"inline-flex items-center justify-center rounded-md p-1.5 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground",
				className,
			)}
			aria-label="Copy to clipboard"
		>
			{copied ? (
				<Check className="size-3.5 text-green-500" />
			) : (
				<Clipboard className="size-3.5" />
			)}
		</button>
	);
}
