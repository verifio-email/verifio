"use client";

import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";
import type React from "react";

interface EndpointCardProps {
	title: string;
	description: string;
	href: string;
	badge?: string;
	icon: string;
	isLast?: boolean;
}

const EndpointCard: React.FC<EndpointCardProps> = ({
	title,
	description,
	href,
	badge,
	icon,
	isLast = false,
}) => {
	return (
		<Link
			href={href}
			className={cn(
				"group flex flex-1 p-6 transition-all duration-200 lg:p-6",
				"hover:bg-bg-weak-50",
				!isLast && "border-stroke-soft-200 border-r",
			)}
		>
			{/* Content */}
			<div className="relative min-w-0 flex-1">
				<div className="flex items-start gap-5">
					<Icon name={icon} className="mt-[4px] h-4 w-4 flex-shrink-0" />
					<div className="flex flex-col gap-2">
						<h3 className="font-medium text-text-strong-950">{title}</h3>
						<p className="text-[13px] text-text-sub-600 leading-relaxed">
							{description}
						</p>
					</div>
				</div>
				{badge && (
					<span className="absolute top-[2px] right-[2px] rounded bg-primary-alpha-16 px-1.5 py-0.5 font-medium text-[10px] text-primary-darker uppercase leading-[14px]">
						{badge}
					</span>
				)}
			</div>
		</Link>
	);
};

interface ExploreEndpointsSectionProps {
	endpoints: {
		title: string;
		description: string;
		href: string;
		badge?: string;
		icon: string;
	}[];
	orgSlug: string;
}

export const ExploreEndpointsSection: React.FC<
	ExploreEndpointsSectionProps
> = ({ endpoints, orgSlug }) => {
	return (
		<div>
			<div className="border-stroke-soft-200 border-b">
				{/* Header section */}
				<div className="px-6">
					<div className="border-stroke-soft-200 border-r border-b border-l px-5 pt-6 pb-5">
						<h2 className="font-semibold text-text-strong-950 text-xl">
							Explore our endpoints
						</h2>
						<p className="mt-1 text-[13px] text-text-sub-600">
							Power your applications with our comprehensive email verification
							API
						</p>
					</div>
				</div>

				{/* Cards grid */}
				<div className="px-6">
					<div className="flex flex-col border-stroke-soft-200 border-r border-l md:flex-row">
						{endpoints.map((endpoint, index) => (
							<EndpointCard
								key={endpoint.title}
								title={endpoint.title}
								icon={endpoint.icon}
								description={endpoint.description}
								href={`/${orgSlug}/${endpoint.href}`}
								badge={endpoint.badge}
								isLast={index === endpoints.length - 1}
							/>
						))}
					</div>
				</div>
			</div>
			<div className="h-16 border-stroke-soft-200 border-b" />
		</div>
	);
};
