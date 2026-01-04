interface ScoreVisualizationProps {
	score: number;
}

export function ScoreVisualization({ score }: ScoreVisualizationProps) {
	const getScorePosition = (score: number) => {
		return `${score}%`;
	};

	return (
		<div className="px-6 py-6">
			<div className="relative">
				{/* Score indicator circle */}
				<div
					className="-top-3 absolute flex h-12 w-12 items-center justify-center rounded-full bg-error-lighter font-semibold text-error-base text-sm"
					style={{
						left: getScorePosition(score),
						transform: "translateX(-50%)",
					}}
				>
					{score}
				</div>
				{/* Progress bar */}
				<div className="mt-6 h-2 w-full rounded-full bg-stroke-soft-100">
					<div className="relative h-full">
						{/* Gradient segments */}
						<div className="absolute inset-0 flex">
							<div className="h-full w-[20%] rounded-l-full bg-error-base" />
							<div className="h-full w-[30%] bg-warning-base" />
							<div className="h-full w-[50%] rounded-r-full bg-success-base" />
						</div>
					</div>
				</div>
				{/* Labels */}
				<div className="mt-2 flex justify-between text-xs text-text-sub-600">
					<span>0</span>
					<span>20</span>
					<span>50</span>
					<span>80</span>
					<span>100</span>
				</div>
			</div>
		</div>
	);
}
