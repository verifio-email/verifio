import { LogoName } from "@verifio/ui/logo";
import Link from "next/link";
import { NewsletterSignup } from "./newsletter-signup";

const links = [
	{
		group: "Solutions",
		items: [
			{
				title: "Bulk Email Verification",
				href: "/solutions/bulk-email-verification",
			},
			{
				title: "Single Email Checker",
				href: "/tools/email-checker",
			},
			{
				title: "Real-time API",
				href: "/solutions/real-time-api",
			},
			{
				title: "Integrations",
				href: "/integrations",
			},
			{
				title: "Email Finder",
				href: "/tools/email-finder",
			},
		],
	},
	{
		group: "Developers",
		items: [
			{
				title: "Documentation",
				href: "/docs",
			},
			{
				title: "API Reference",
				href: "/docs/api-reference",
			},
			{
				title: "SDKs & Libraries",
				href: "/docs/sdks",
			},
			{
				title: "Webhooks",
				href: "/docs/webhooks",
			},
			{
				title: "Changelog",
				href: "/changelog",
			},
		],
	},
	{
		group: "Resources",
		items: [
			{
				title: "Email Verification Guide",
				href: "/resources/email-verification-guide",
			},
			{
				title: "Blog",
				href: "/blog",
			},
			{
				title: "Pricing",
				href: "/pricing",
			},
			{
				title: "Compare Verifio",
				href: "/compare",
			},
			{
				title: "Status",
				href: "/status",
			},
		],
	},
	{
		group: "Company",
		items: [
			{
				title: "About Us",
				href: "/about",
			},
			{
				title: "Contact",
				href: "/contact",
			},
			{
				title: "Privacy Policy",
				href: "/privacy",
			},
			{
				title: "Terms of Service",
				href: "/terms",
			},
			{
				title: "GDPR Compliance",
				href: "/gdpr",
			},
		],
	},
];

export const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer>
			<div className="border-stroke-soft-100 border-t border-b">
				<div className="mx-4 max-w-7xl border-stroke-soft-100 border-r border-l md:mx-auto">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-4 py-2 md:px-10 md:py-4">
						<span className="text-text-sub-600 text-xs md:text-sm">Footer</span>
						<span className="text-text-sub-600 text-xs md:text-sm">
							/ Socials + Resources
						</span>
					</div>
					<div className="grid grid-cols-1 gap-0 md:grid-cols-2">
						<div className="border-stroke-soft-100 px-4 py-6 text-center md:border-r md:px-10 md:py-10 md:text-left">
							<div className="flex items-center justify-center gap-3 md:justify-start">
								<LogoName className="h-8 rounded-full md:h-10" />
							</div>
							<p className="mx-auto max-w-xs pt-6 text-sm font-medium md:mx-0 md:pt-8 md:text-base">
								Verify emails at scale with 99% accuracy. Reduce bounces,
								protect your sender reputation.
							</p>
						</div>

						<div className="flex flex-col">
							{/* Newsletter Signup */}
							<div className="order-2 md:order-1">
								<NewsletterSignup />
							</div>
							<div className="order-1 grid grid-cols-2 md:order-2">
								<Link
									href="https://linkedin.com/company/reloop"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 border-stroke-soft-100 border-t border-r border-b p-3 text-text-sub-600 text-xs transition-colors hover:text-primary-base md:gap-3 md:border-t-0 md:p-4 md:text-sm"
								>
									<svg
										className="size-4 md:size-5"
										xmlns="http://www.w3.org/2000/svg"
										width="1em"
										height="1em"
										viewBox="0 0 24 24"
									>
										<path
											fill="currentColor"
											d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
										/>
									</svg>
									<span>Linkedin</span>
								</Link>
								<Link
									href="https://x.com/verifiohq"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 border-stroke-soft-100 border-b p-3 text-text-sub-600 text-xs transition-colors hover:text-primary-base md:gap-3 md:p-4 md:text-sm border-t md:border-t-0"
								>
									<svg
										className="size-4 md:size-5"
										xmlns="http://www.w3.org/2000/svg"
										width="1em"
										height="1em"
										viewBox="0 0 24 24"
									>
										<path
											fill="currentColor"
											d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"
										/>
									</svg>
									<span>X [Twitter]</span>
								</Link>
								<Link
									href="https://github.com/reloop-labs/verifio"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 border-stroke-soft-100 border-r p-3 text-text-sub-600 text-xs transition-colors hover:text-primary-base md:gap-3 md:p-4 md:text-sm"
								>
									<svg
										className="size-4 md:size-5"
										xmlns="http://www.w3.org/2000/svg"
										width="1em"
										height="1em"
										viewBox="0 0 24 24"
									>
										<path
											fill="currentColor"
											d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482c0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10"
										/>
									</svg>
									<span>Github</span>
								</Link>
								<Link
									href="https://discord.gg/verifio"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 border-stroke-soft-100 p-3 text-xs text-text-sub-600 transition-colors hover:text-primary-base md:gap-3 md:p-4 md:text-sm"
								>
									<svg
										className="size-4 md:size-5"
										xmlns="http://www.w3.org/2000/svg"
										width="1em"
										height="1em"
										viewBox="0 0 24 24"
									>
										<path
											fill="currentColor"
											d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"
										/>
									</svg>
									<span>Discord</span>
								</Link>
							</div>
						</div>
					</div>
				</div>
				<div className="mx-4 h-10 max-w-7xl border border-stroke-soft-100 md:mx-auto md:h-16" />
				<div className="mx-4 max-w-7xl border-stroke-soft-100 border-r border-l md:mx-auto">
					<div className="grid grid-cols-2 gap-0 border-stroke-soft-100 md:grid-cols-4">
						{links.map((link, index) => (
							<div
								key={index}
								className={`border-stroke-soft-100 ${index % 2 !== 1 ? "border-r" : ""} ${index < 2 ? "border-b md:border-b-0" : ""} ${index < links.length - 1 ? "md:border-r" : "md:border-r-0"}`}
							>
								<div className="space-y-0">
									<span className="block border-stroke-soft-100 border-b px-4 py-4 font-medium text-xs text-text-strong-950 md:px-6 md:py-6 md:text-sm">
										{link.group}
									</span>
									<div className="space-y-0">
										{link.items.map((item, itemIndex) => (
											<div
												key={itemIndex}
												className={`border-stroke-soft-100 px-4 md:px-6 ${
													itemIndex < link.items.length - 1 ? "border-b" : ""
												}`}
											>
												<Link
													href={item.href}
													className="block py-2 text-xs text-text-sub-600 transition-colors duration-150 hover:text-primary-base md:py-3 md:text-[13px]"
												>
													{item.title}
												</Link>
											</div>
										))}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Lower Footer Section - Copyright, Status, Legal */}
				<div className="mx-4 max-w-7xl border-stroke-soft-100 border-t border-r border-b border-l md:mx-auto">
					<div className="flex flex-col items-start justify-between gap-3 px-4 py-4 sm:flex-row sm:items-center md:gap-4 md:px-6 md:py-6">
						<div className="flex gap-2 items-center md:gap-3">
							<span className="text-xs text-text-sub-600 md:text-sm">
								© {currentYear} Verifio
							</span>
							<div className="flex items-center gap-2">
								<div className="size-2 rounded-full bg-primary-base" />
								<span className="text-xs text-text-sub-600 md:text-sm">
									All systems normal
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className="mx-4 h-10 max-w-7xl border-stroke-soft-100 border-r border-l md:mx-auto md:h-16" />
			</div>
		</footer>
	);
};
