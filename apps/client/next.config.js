/** @type {import('next').NextConfig} */
const nextConfig = {
  // Client app runs at root path
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unpuzzle.b-cdn.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
  output: process.env.VERCEL ? undefined : 'standalone',
};

module.exports = nextConfig;