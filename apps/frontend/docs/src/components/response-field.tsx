import { cn } from "@fe/docs/lib/cn";

interface ResponseFieldProps {
	name: string;
	type: string;
	children?: React.ReactNode;
}

export function ResponseField({ name, type, children }: ResponseFieldProps) {
	return (
		<div className="flex flex-col gap-1 border-fd-border border-b py-2.5 first:pt-0 last:border-0 last:pb-0">
			<div className="flex items-center gap-2">
				<code className="font-medium text-fd-foreground text-sm">{name}</code>
				<span className="rounded bg-fd-muted px-1.5 py-0.5 font-mono text-fd-muted-foreground text-xs">
					{type}
				</span>
			</div>
			{children && (
				<div className="pl-0 text-fd-muted-foreground text-sm">{children}</div>
			)}
		</div>
	);
}

interface ResponseGroupProps {
	title?: string;
	children: React.ReactNode;
	className?: string;
}

export function ResponseGroup({
	title,
	children,
	className,
}: ResponseGroupProps) {
	return (
		<div
			className={cn(
				"not-prose rounded-lg border border-fd-border bg-fd-card p-4",
				className,
			)}
		>
			{title && (
				<h5 className="mb-3 font-semibold text-fd-muted-foreground text-xs uppercase tracking-wide">
					{title}
				</h5>
			)}
			{children}
		</div>
	);
}
