import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL;

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    if (!backendUrl) {
      console.warn('[next.config] BACKEND_URL is not set — API rewrites disabled.');
      return [];
    }
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
