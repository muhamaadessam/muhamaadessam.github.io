import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  cacheMaxMemorySize: 10 * 1024 * 1024,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
