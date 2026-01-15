import { cn } from "@fe/docs/lib/cn";

interface StepProps {
	number: number;
	title: string;
	children: React.ReactNode;
}

export function Step({ number, title, children }: StepProps) {
	return (
		<div className="relative flex gap-4 pb-8 last:pb-0">
			{/* Vertical line */}
			<div className="absolute top-8 bottom-0 left-4 w-px bg-fd-border last:hidden" />

			{/* Step number */}
			<div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fd-primary font-bold text-fd-primary-foreground text-sm">
				{number}
			</div>

			{/* Content */}
			<div className="flex-1 pt-0.5">
				<h4 className="mb-2 font-semibold text-fd-foreground">{title}</h4>
				<div className="text-fd-muted-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
					{children}
				</div>
			</div>
		</div>
	);
}

interface StepsProps {
	children: React.ReactNode;
	className?: string;
}

export function Steps({ children, className }: StepsProps) {
	return <div className={cn("not-prose my-6", className)}>{children}</div>;
}
