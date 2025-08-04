import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import path from "path";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Enable trailing slash for better routing
  trailingSlash: false,
  // Ensure dynamic routes work in production
  output: 'standalone',
  // Allow cross-origin requests during development
  allowedDevOrigins: ['dev.nazmulcodes.org', 'dev1.nazmulcodes.org', 'dev2.nazmulcodes.org'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unpuzzle.b-cdn.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.gravatar.com",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "date-fns",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Skip pre-rendering error pages during build
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname),
      "@components": path.resolve(__dirname, "app/components"),
      "@hooks": path.resolve(__dirname, "app/hooks"),
      "@context": path.resolve(__dirname, "app/context"),
      "@types": path.resolve(__dirname, "app/types"),
      "@services": path.resolve(__dirname, "app/services"),
      "@redux": path.resolve(__dirname, "app/redux"),
    };
    return config;
  },
  async rewrites() {
    console.log(process.env.NODE_ENV)
    if (process.env.NODE_ENV == "production") {
      return [];
    }

    return [
      {
        source: "/instructor/:match*",
        destination: "https://dev2.nazmulcodes.org/:match*",
      },
      {
        source: "/sign-up",
        destination: "https://dev1.nazmulcodes.org/sign-up",
      },
      {
        source: "/sign-in",
        destination: "https://dev1.nazmulcodes.org/sign-in",
      },
      {
        source: "/api/:match*",
        destination: "https://dev1.nazmulcodes.org/api/:match*",
      },
      {
        source: "/course-video/:id",
        destination: "https://dev1.nazmulcodes.org/course-video/:id",
      }
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
