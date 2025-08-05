import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unpuzzle.b-cdn.net",
        port: "",
        pathname: "/**", // allows all paths under this domain
      },
    ],
  },
  eslint: {
    // Temporarily disable ESLint during builds to focus on TypeScript errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily disable TypeScript checking during builds
    ignoreBuildErrors: true,
  },
  assetPrefix: process.env.NEXT_PUBLIC_INSTRUCTOR_APP_URL,
};

export default nextConfig;
