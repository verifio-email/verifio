import * as Button from "@verifio/ui/button";
import Link from "next/link";

const blogPosts = [
	{
		title: "Email Verification Best Practices for 2024",
		excerpt:
			"Learn how to maximize your email deliverability with these proven verification strategies.",
		date: "Dec 20, 2024",
		category: "Guide",
		slug: "email-verification-best-practices-2024",
	},
	{
		title: "How Disposable Emails Hurt Your Marketing",
		excerpt:
			"Discover why disposable emails are costing you money and how to detect them.",
		date: "Dec 15, 2024",
		category: "Insights",
		slug: "disposable-emails-marketing-impact",
	},
	{
		title: "Understanding Email Bounce Rates",
		excerpt:
			"A deep dive into hard bounces, soft bounces, and how to reduce them.",
		date: "Dec 10, 2024",
		category: "Tutorial",
		slug: "understanding-email-bounce-rates",
	},
	{
		title: "API vs Bulk Verification: Which is Right for You?",
		excerpt:
			"Compare real-time API verification with bulk list cleaning to find the best fit.",
		date: "Dec 5, 2024",
		category: "Comparison",
		slug: "api-vs-bulk-verification",
	},
];

export default function BlogPage() {
	return (
		<div className="min-h-screen">
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[01] BLOG</span>
						<span className="text-sm text-text-sub-600">
							/ INSIGHTS & GUIDES
						</span>
					</div>
					<div className="px-10 py-16 text-center">
						<h1 className="mx-auto max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
							Email Verification Blog
						</h1>
						<p className="mx-auto mt-6 max-w-xl text-lg text-text-sub-600">
							Tips, guides, and insights to improve your email deliverability
						</p>
					</div>
				</div>
			</section>

			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="grid gap-0 md:grid-cols-2">
						{blogPosts.map((post, index) => (
							<Link
								key={post.slug}
								href={`/blog/${post.slug}`}
								className={`block border-stroke-soft-100 p-10 transition-colors hover:bg-bg-weak-50 ${index % 2 === 0 ? "border-r" : ""} ${index < 2 ? "border-b" : ""}`}
							>
								<span className="rounded-full bg-primary-100 px-3 py-1 font-medium text-primary-600 text-xs">
									{post.category}
								</span>
								<h2 className="mt-4 font-semibold text-text-strong-950 text-xl">
									{post.title}
								</h2>
								<p className="mt-2 text-text-sub-600">{post.excerpt}</p>
								<p className="mt-4 text-sm text-text-sub-600">{post.date}</p>
							</Link>
						))}
					</div>
				</div>
			</section>

			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="p-10 text-center md:p-16">
						<h2 className="font-semibold text-2xl text-text-strong-950">
							Stay updated
						</h2>
						<p className="mt-2 text-text-sub-600">
							Get the latest email verification tips in your inbox
						</p>
						<div className="mx-auto mt-6 flex max-w-md gap-3">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 rounded-lg border border-stroke-soft-100 bg-white px-4 py-3 outline-none focus:border-primary-500"
							/>
							<button
								type="button"
								className={Button.buttonVariants({
									variant: "primary",
									size: "medium",
								}).root({})}
							>
								Subscribe
							</button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
