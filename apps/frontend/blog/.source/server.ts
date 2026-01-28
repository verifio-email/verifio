// @ts-nocheck

import { server } from "fumadocs-mdx/runtime/server";
import * as __fd_glob_0 from "../content/docs/free-email-verification-tools.mdx?collection=docs";
import * as __fd_glob_1 from "../content/docs/hello-world.mdx?collection=docs";
import * as __fd_glob_2 from "../content/docs/how-to-verify-email-address.mdx?collection=docs";
import * as __fd_glob_3 from "../content/docs/what-is-email-verification.mdx?collection=docs";
import type * as Config from "../source.config";

const create = server<
	typeof Config,
	import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
		DocData: {};
	}
>({ doc: { passthroughs: ["extractedReferences"] } });

export const docs = await create.docs(
	"docs",
	"content/docs",
	{},
	{
		"free-email-verification-tools.mdx": __fd_glob_0,
		"hello-world.mdx": __fd_glob_1,
		"how-to-verify-email-address.mdx": __fd_glob_2,
		"what-is-email-verification.mdx": __fd_glob_3,
	},
);
