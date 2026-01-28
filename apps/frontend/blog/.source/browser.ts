// @ts-nocheck
import { browser } from "fumadocs-mdx/runtime/browser";
import type * as Config from "../source.config";

const create = browser<
	typeof Config,
	import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
		DocData: {};
	}
>();
const browserCollections = {
	docs: create.doc("docs", {
		"free-email-verification-tools.mdx": () =>
			import(
				"../content/docs/free-email-verification-tools.mdx?collection=docs"
			),
		"hello-world.mdx": () =>
			import("../content/docs/hello-world.mdx?collection=docs"),
		"how-to-verify-email-address.mdx": () =>
			import("../content/docs/how-to-verify-email-address.mdx?collection=docs"),
		"what-is-email-verification.mdx": () =>
			import("../content/docs/what-is-email-verification.mdx?collection=docs"),
	}),
};
export default browserCollections;
