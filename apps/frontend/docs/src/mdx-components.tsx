import { APIPage } from "@fe/docs/components/api-page";
import * as File from "fumadocs-ui/components/files";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

// make sure you can use APIPage in MDX files
export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		APIPage,
		...TabsComponents,
		...File,
		...components,
	};
}
