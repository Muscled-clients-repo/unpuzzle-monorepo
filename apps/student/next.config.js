/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/student',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '/student',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unpuzzle.b-cdn.net",
        port: "",
        pathname: "/**",
      },
    ],
    path: `${process.env.NEXT_PUBLIC_BASE_PATH || '/student'}/_next/image`,
  },
  output: 'standalone',
};

module.exports = nextConfig;