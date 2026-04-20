import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.100.17", "localhost:3000"],
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
};

export default nextConfig;
