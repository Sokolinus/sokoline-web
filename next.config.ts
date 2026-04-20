import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: true,
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
        protocol: "http",
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
      {
        protocol: "http",
        hostname: "api.sokoline.app",
        port: "",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/remote-proxy/:path*",
        destination: "https://api.sokoline.app/:path*",
      },
    ];
  },
};

export default nextConfig;
