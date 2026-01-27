import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	allowedDevOrigins: ["local.verifio.email", "*.local.verifio.email"],
};

export default nextConfig;
