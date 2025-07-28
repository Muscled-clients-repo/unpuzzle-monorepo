/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/apps/instructor/:path*',
        destination: 'http://localhost:3002/:path*', // Proxy to instructor app in development
      },
      {
        source: '/apps/student/:path*',
        destination: 'http://localhost:3003/:path*', // Proxy to student app in development
      },
    ]
  },
}

module.exports = nextConfig