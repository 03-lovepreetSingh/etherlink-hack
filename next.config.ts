import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 2678400,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "s3.tebi.io",
      },
      {
        protocol: "https",
        hostname: "gursagar.app.n8n.cloud",
      },
      {
        protocol: "https",
        hostname: "gitfund-chat-app.vercel.app",
      },
      {
        protocol: "https",
        hostname: "s4wo8cksggo84c8kw4g884ss.server.gitfund.tech",
      },
      {
        protocol: "http",
        hostname: "s4wo8cksggo84c8kw4g884ss.server.gitfund.tech/",
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Add headers configuration for Cross-Origin-Opener-Policy
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
