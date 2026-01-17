import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	basePath: "/docs",
	output: "standalone",
	async redirects() {
		return [
			{
				source: "/",
				destination: "/guides",
				permanent: true,
			},
		];
	},
};

export default withMDX(config);
