import { cn } from "@fe/docs/lib/cn";

interface ParamRowProps {
	name: string;
	type: string;
	required?: boolean;
	defaultValue?: string;
	children?: React.ReactNode;
}

export function ParamRow({
	name,
	type,
	required = false,
	defaultValue,
	children,
}: ParamRowProps) {
	return (
		<div className="flex flex-col gap-1.5 border-fd-border border-b py-3 first:pt-0 last:border-0 last:pb-0">
			<div className="flex flex-wrap items-center gap-2">
				<code className="font-semibold text-fd-foreground text-sm">{name}</code>
				<span className="font-mono text-fd-muted-foreground text-xs">
					{type}
				</span>
				{required && (
					<span className="font-medium text-red-500 text-xs">required</span>
				)}
				{defaultValue && (
					<span className="text-fd-muted-foreground text-xs">
						Default: <code className="text-fd-foreground">{defaultValue}</code>
					</span>
				)}
			</div>
			{children && (
				<div className="text-fd-muted-foreground text-sm">{children}</div>
			)}
		</div>
	);
}

interface ParamTableProps {
	children: React.ReactNode;
	className?: string;
}

export function ParamTable({ children, className }: ParamTableProps) {
	return (
		<div
			className={cn(
				"not-prose rounded-lg border border-fd-border bg-fd-card p-4",
				className,
			)}
		>
			{children}
		</div>
	);
}
