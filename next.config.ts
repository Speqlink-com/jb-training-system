import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allow cross-origin requests from network IP for development
  allowedDevOrigins: ['192.168.0.101'],
};

export default nextConfig;
