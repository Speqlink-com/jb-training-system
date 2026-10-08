import type { NextConfig } from "next";

const defaultApiProxyTarget = process.env.NODE_ENV === "production"
  ? "https://trainsyt.speqlink.com:2096"
  : "http://127.0.0.1:8000";
const configuredApiProxyTarget = (process.env.API_PROXY_TARGET || defaultApiProxyTarget).replace(/\/$/, "");
// Keep existing Vercel projects functional if they still have the former
// portless target configured. Port 443 is owned by the shared Kong gateway.
const apiProxyTarget = process.env.NODE_ENV === "production"
  && configuredApiProxyTarget === "https://trainsyt.speqlink.com"
  ? "https://trainsyt.speqlink.com:2096"
  : configuredApiProxyTarget;

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
