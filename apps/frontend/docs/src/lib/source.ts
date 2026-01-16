import { loader } from "fumadocs-core/source";
import { openapiPlugin } from "fumadocs-openapi/server";
import { docs } from "../../.source/server";

export const source = loader({
	baseUrl: "/",
	source: docs.toFumadocsSource(),
	plugins: [openapiPlugin()],
});
