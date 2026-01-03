"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Section {
	id: string;
	title: string;
	num: string;
}

interface TableOfContentsProps {
	sections: Section[];
	relatedLink?: {
		href: string;
		label: string;
	};
}

export function TableOfContents({
	sections,
	relatedLink,
}: TableOfContentsProps) {
	const [activeId, setActiveId] = useState<string>("");

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
					}
				}
			},
			{
				rootMargin: "-100px 0px -80% 0px",
				threshold: 0,
			},
		);

		// Observe all section elements
		for (const section of sections) {
			const element = document.getElementById(section.id);
			if (element) {
				observer.observe(element);
			}
		}

		return () => observer.disconnect();
	}, [sections]);

	return (
		<nav className="sticky top-[66px] p-6 md:p-10">
			<p className="mb-4 font-medium text-text-strong-950 text-xs uppercase tracking-wider">
				On this page
			</p>
			<ul className="space-y-1">
				{sections.map((section) => {
					const isActive = activeId === section.id;
					return (
						<li key={section.id}>
							<a
								href={`#${section.id}`}
								className={`flex items-center gap-3 rounded-md px-2 py-1.5 text-xs transition-all ${
									isActive
										? "bg-primary-50 font-medium text-primary-base"
										: "text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950"
								}`}
							>
								<span
									className={
										isActive ? "text-primary-base" : "text-text-soft-400"
									}
								>
									[{section.num}]
								</span>
								<span>{section.title}</span>
							</a>
						</li>
					);
				})}
			</ul>
			{relatedLink && (
				<div className="mt-8 border-stroke-soft-100/60 border-t pt-6">
					<Link
						href={relatedLink.href}
						className="flex items-center gap-2 text-text-sub-600 text-xs transition-colors hover:text-text-strong-950"
					>
						<span>{relatedLink.label}</span>
						<span>→</span>
					</Link>
				</div>
			)}
		</nav>
	);
}
