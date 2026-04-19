import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.100.17", "localhost:3000"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sokoline.sfo3.cdn.digitaloceanspaces.com",
        port: "",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "api.sokoline.app",
        port: "",
        pathname: "/media/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/remote/:path*",
        destination: "https://api.sokoline.app/api/:path*/", // Added trailing slash for Django
      },
    ];
  },
};

export default nextConfig;
