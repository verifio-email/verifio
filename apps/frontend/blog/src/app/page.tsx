import { source } from "@fe/blog/lib/source";
import Link from "next/link";
import { DocsDescription, DocsTitle } from "fumadocs-ui/page";

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
                        className="group block rounded-lg border p-6 hover:bg-muted/50 transition-colors"
                    >
                        <h2 className="text-xl font-semibold mb-2 group-hover:text-primary">
                            {page.data.title}
                        </h2>
                        {page.data.description && (
                            <p className="text-muted-foreground">
                                {page.data.description}
                            </p>
                        )}
                    </Link>
                ))}
            </div>
        </main>
    );
}
