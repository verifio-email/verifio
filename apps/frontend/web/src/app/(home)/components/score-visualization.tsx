"use client";

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

				{/* Progress bar with manual gradient segments */}
				<div className="relative mt-2 h-1.5 w-full overflow-hidden rounded-full">
					{/* Background segments with colors */}
					<div className="absolute inset-0 flex gap-0.5">
						{/* Red/Blue zone: 0-10% (ends near "0" label) */}
						<div className="h-full w-[4%] bg-primary-base" />
						<div className="h-full w-[6%] bg-error-base" />
						{/* Orange/Yellow zone: 10-80% (from "0" to "80" labels) */}
						<div className="h-full w-[70%] bg-warning-base" />
						{/* Green zone: 80-100% (from "80" to "100" labels) */}
						<div className="h-full w-[20%] bg-success-base" />
					</div>
				</div>

				{/* Labels */}
				<div className="relative mt-2 h-4 w-full text-text-sub-600 font-medium">
					<span className="absolute" style={{ left: "0%" }}>
						?
					</span>
					<span
						className="absolute"
						style={{ left: "4%", transform: "translateX(-50%)" }}
					>
						0
					</span>
					<span
						className="absolute"
						style={{ left: "10%", transform: "translateX(-50%)" }}
					>
						1
					</span>
					<span
						className="absolute"
						style={{ left: "80%", transform: "translateX(-50%)" }}
					>
						80
					</span>
					<span className="absolute" style={{ right: "0%" }}>
						100
					</span>
				</div>
			</div>
		</div>
	);
}
