import { Icon } from "@verifio/ui/icon";

const SKELETON_COUNT = 5;

type LogsStatesProps = {
	loading: boolean;
	error: string | null;
	filteredLogsCount: number;
	search: string;
	onRetry: () => void;
};

export function LogsStates({
	loading,
	error,
	filteredLogsCount,
	search,
	onRetry,
}: LogsStatesProps) {
	// Loading state
	if (loading) {
		return (
			<div className="w-full" aria-live="polite" aria-busy="true">
				{Array.from({ length: SKELETON_COUNT }).map((_, i) => (
					<div key={i} className="border-stroke-soft-200/50 border-b">
						<div className="grid grid-cols-[70px_180px_1fr_80px_80px_40px] items-center gap-4 px-6 py-4">
							<div className="h-6 w-14 animate-pulse rounded-full bg-bg-weak-100" />
							<div className="h-4 w-24 animate-pulse rounded bg-bg-weak-100" />
							<div className="flex items-center gap-3">
								<div className="h-4 w-32 animate-pulse rounded bg-bg-weak-100" />
								<div className="h-3 w-24 animate-pulse rounded bg-bg-weak-100" />
							</div>
							<div className="ml-auto h-4 w-12 animate-pulse rounded bg-bg-weak-100" />
							<div className="mx-auto h-5 w-16 animate-pulse rounded-full bg-bg-weak-100" />
							<div />
						</div>
					</div>
				))}
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-16">
				<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error-alpha-10">
					<Icon name="alert-circle" className="h-8 w-8 text-error-base" />
				</div>
				<h2 className="mb-2 font-medium text-text-strong-950">
					Error loading logs
				</h2>
				<p className="text-text-sub-600">{error}</p>
				<button
					type="button"
					onClick={onRetry}
					className="mt-4 rounded-lg border border-stroke-soft-200 px-4 py-2 text-sm transition-colors hover:bg-bg-weak-50"
				>
					Try again
				</button>
			</div>
		);
	}

	// Empty state
	if (filteredLogsCount === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16">
				<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-weak-50">
					<Icon name="file-text" className="h-8 w-8 text-text-sub-600" />
				</div>
				<h2 className="mb-2 font-medium text-text-strong-950">
					{search ? "No matching logs found" : "No logs found"}
				</h2>
				<p className="text-text-sub-600">
					{search
						? "Try a different search term."
						: "Make some API requests to see them here."}
				</p>
			</div>
		);
	}

	return null;
}
