import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.100.17", "localhost:3000"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.sokoline.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sokoline.sfo3.cdn.digitaloceanspaces.com',
        pathname: '/**',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/remote/:path*",
        destination: "https://api.sokoline.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
