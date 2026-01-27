import { source } from "@fe/blog/lib/source";
import { DocsDescription, DocsTitle } from "fumadocs-ui/page";
import Link from "next/link";

export default function BlogListPage() {
	const pages = source.getPages();

	return (
		<main className="container max-w-4xl py-12">
			<DocsTitle>Blog</DocsTitle>
			<DocsDescription>Latest updates and articles.</DocsDescription>

			<div className="mt-8 flex flex-col gap-6">
				{pages.map((page) => (
					<Link
						key={page.url}
						href={page.url}
						className="group block rounded-lg border p-6 transition-colors hover:bg-muted/50"
					>
						<h2 className="mb-2 font-semibold text-xl group-hover:text-primary">
							{page.data.title}
						</h2>
						{page.data.description && (
							<p className="text-muted-foreground">{page.data.description}</p>
						)}
					</Link>
				))}
			</div>
		</main>
	);
}
