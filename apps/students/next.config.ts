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
  async redirects() {
    return [
      {
        source: '/instructor',
        destination: process.env.NEXT_PUBLIC_INSTRUCTOR_APP_URL || 'https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app',
        permanent: false,
        basePath: false,
      },
      {
        source: '/instructor/:path*',
        destination: `${process.env.NEXT_PUBLIC_INSTRUCTOR_APP_URL || 'https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app'}/:path*`,
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
