"use client";

import { Line } from "rc-progress";

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
				{/* Score indicator tooltip/pin */}
				<div
					className="-top-14 absolute flex flex-col items-center"
					style={{
						left: getScorePosition(score),
						transform: "translateX(-50%)",
					}}
				>
					{/* Tooltip bubble */}
					<div className="flex h-10 w-12 items-center justify-center rounded-lg bg-success-lighter font-semibold text-base text-success-base shadow-sm">
						{score}
					</div>
					{/* Pin/pointer */}
					<div
						className="h-0 w-0 border-t-6 border-t-success-lighter border-r-6 border-r-transparent border-l-6 border-l-transparent"
						style={{
							borderLeftWidth: "6px",
							borderRightWidth: "6px",
							borderTopWidth: "6px",
						}}
					/>
					{/* Vertical line connecting to bar */}
					<div className="h-4 w-0.5 bg-success-base" />
					{/* Circle at connection point */}
					<div className="h-2.5 w-2.5 rounded-full bg-success-base" />
				</div>

				{/* Progress bar with rc-progress */}
				<div className="relative mt-2 h-1.5">
					<Line
						percent={100}
						strokeWidth={1.5}
						trailWidth={1.5}
						strokeColor={{
							"0%": "hsl(var(--error-base))",
							"5%": "hsl(var(--error-base))",
							"20%": "hsl(var(--warning-base))",
							"50%": "hsl(var(--warning-base))",
							"80%": "hsl(var(--success-base))",
							"100%": "hsl(var(--success-base))",
						}}
						trailColor="transparent"
						strokeLinecap="round"
					/>
				</div>

				{/* Labels */}
				<div className="mt-2 flex justify-between text-xs text-text-sub-600">
					<span>?</span>
					<span>0</span>
					<span>1</span>
					<span>80</span>
					<span>100</span>
				</div>
			</div>
		</div>
	);
}
