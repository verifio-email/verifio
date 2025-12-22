import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	basePath: "/dashboard",
	output: "standalone",
	allowedDevOrigins: ["local.verifio.email", "*.local.verifio.email"],
};

export default nextConfig;
