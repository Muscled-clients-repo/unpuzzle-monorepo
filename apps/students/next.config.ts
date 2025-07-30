import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'date-fns'
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // async rewrites(){
  //   return [
  //     {
  //       "source": "/instructor/:match*",
  //       "destination": "http://localhost:30002/:match*"
  //     },
  //     {
  //       "source": "/sign-up",
  //       "destination": "https://dev.nazmulcodes.org/sign-up"
  //     },
  //     {
  //       "source": "/sign-in",
  //       "destination": "https://dev.nazmulcodes.org/sign-in"
  //     },
  //     {
  //       "source": "/api/:match*",
  //       "destination": "https://dev.nazmulcodes.org/api/:match*"
  //     },
  //     {
  //       "source": "/courses/:id",
  //       "destination": "https://dev.nazmulcodes.org/courses/:id"
  //     }
  //   ]
  // }
};

export default withBundleAnalyzer(nextConfig);
