import type { NextConfig } from "next";

const defaultApiProxyTarget = process.env.NODE_ENV === "production"
  ? "https://trainsyt.speqlink.com"
  : "http://127.0.0.1:8000";
const apiProxyTarget = (process.env.API_PROXY_TARGET || defaultApiProxyTarget).replace(/\/$/, "");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.101", "192.168.0.104", "192.168.1.100", "192.168.155.26"],
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${apiProxyTarget}/:path*`,
      },
    ];
  },
};

export default nextConfig;
