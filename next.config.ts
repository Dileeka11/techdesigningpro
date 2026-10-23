import type { NextConfig } from "next";

// Set BASE_PATH (e.g. /web/techdesigningpro) when the site lives in a sub-folder.
const basePath = process.env.BASE_PATH?.replace(/\/+$/, "") || "";

// Static HTML export so the whole site can be uploaded to any shared host
// (cPanel / public_html) without a Node.js server.
const nextConfig: NextConfig = {
  output: "export",
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["three"],
  },
};

export default nextConfig;
