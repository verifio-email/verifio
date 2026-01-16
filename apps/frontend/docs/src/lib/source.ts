import { loader } from "fumadocs-core/source";
import { openapiPlugin } from "fumadocs-openapi/server";
import { BookOpen, Terminal } from "lucide-react";
import { createElement } from "react";
import { docs } from "../../.source/server";

export const source = loader({
	baseUrl: "/",
	source: docs.toFumadocsSource(),
	plugins: [openapiPlugin()],
	icon(icon) {
		if (icon === "book") {
			return createElement(BookOpen);
		}
		if (icon === "terminal") {
			return createElement(Terminal);
		}
	},
});
