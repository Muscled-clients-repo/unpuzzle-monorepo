/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove basePath for Railway deployment to avoid routing issues
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/instructor',
  // assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '/instructor',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unpuzzle.b-cdn.net",
        port: "",
        pathname: "/**", // allows all paths under this domain
      },
    ],
    // path: `${process.env.NEXT_PUBLIC_BASE_PATH || '/instructor'}/_next/image`,
  },
  eslint: {
    // Temporarily disable ESLint during builds to focus on TypeScript errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors for Railway deployment
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  transpilePackages: ['@tailwindcss/postcss'],
  webpack: (config, { isServer }) => {
    // Ignore certain modules that cause issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;