"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const alternatives = [
	"ZeroBounce",
	"Emailable",
	"NeverBounce",
	"Hunter",
	"Clearout",
];

type Phase = "typing" | "holding" | "erasing";

export function AnimatedAlternative() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [displayedText, setDisplayedText] = useState("");
	const [phase, setPhase] = useState<Phase>("typing");

	const currentWord = alternatives[currentIndex] ?? "";

	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout>;

		if (phase === "typing") {
			if (displayedText.length < currentWord.length) {
				// Type next character
				timeout = setTimeout(() => {
					setDisplayedText(currentWord.slice(0, displayedText.length + 1));
				}, 80);
			} else {
				// Finished typing, hold before erasing
				timeout = setTimeout(() => {
					setPhase("holding");
				}, 2000);
			}
		} else if (phase === "holding") {
			// Start erasing
			timeout = setTimeout(() => {
				setPhase("erasing");
			}, 100);
		} else if (phase === "erasing") {
			if (displayedText.length > 0) {
				// Erase one character
				timeout = setTimeout(() => {
					setDisplayedText(displayedText.slice(0, -1));
				}, 50); // Faster erase speed
			} else {
				// Finished erasing, switch to next word
				timeout = setTimeout(() => {
					setCurrentIndex((prev) => (prev + 1) % alternatives.length);
					setPhase("typing");
				}, 200);
			}
		}

		return () => clearTimeout(timeout);
	}, [displayedText, phase, currentWord]);

	return (
		<span className="inline-flex items-center gap-1.5 text-sm">
			<span className="text-text-sub-600/80">
				An open-source alternative to
			</span>
			<span className="inline-block text-left font-semibold">
				{displayedText}
				<motion.span
					animate={{ opacity: [1, 0] }}
					transition={{
						duration: 0.5,
						repeat: Number.POSITIVE_INFINITY,
						repeatType: "reverse",
					}}
					className="ml-[1px] inline-block w-[2px] bg-bg-strong-950"
					style={{ height: "1em", verticalAlign: "text-bottom" }}
				/>
			</span>
		</span>
	);
}
