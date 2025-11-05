import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: 'export' to enable API routes and MongoDB
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'pega.micecon.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pega.micecon.com',
      },
    ],
  },
};

export default nextConfig;
