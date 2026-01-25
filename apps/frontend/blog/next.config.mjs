import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
    reactStrictMode: true,
    basePath: "/blog",
    output: "standalone",
};

export default withMDX(config);
