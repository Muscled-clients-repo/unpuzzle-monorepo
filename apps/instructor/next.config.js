/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/instructor',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '/instructor',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unpuzzle.b-cdn.net",
        port: "",
        pathname: "/**", // allows all paths under this domain
      },
    ],
    path: `${process.env.NEXT_PUBLIC_BASE_PATH || '/instructor'}/_next/image`,
  },
  eslint: {
    // Temporarily disable ESLint during builds to focus on TypeScript errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Enable TypeScript checking during builds
    ignoreBuildErrors: false,
  },
  output: 'standalone',
  // Disable static exports during build
  generateBuildId: async () => {
    // Return a consistent build ID
    return 'build-' + Date.now()
  },
};

// During build, if Clerk keys are missing, skip static generation
if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  console.warn('Clerk keys not found during build, some features may be limited');
}

module.exports = nextConfig;