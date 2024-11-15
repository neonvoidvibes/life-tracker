import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Disable image optimization since it requires extra dependencies
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
