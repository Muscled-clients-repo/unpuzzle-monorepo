/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Configure base path handling
  basePath: '',
  
  // Configure rewrites to route to different apps based on path
  async rewrites() {
    return {
      beforeFiles: [
        // Instructor app routes
        {
          source: '/instructor',
          destination: '/apps/instructor',
        },
        {
          source: '/instructor/:path*',
          destination: '/apps/instructor/:path*',
        },
        // API routes for instructor
        {
          source: '/api/instructor/:path*',
          destination: '/apps/instructor/api/:path*',
        },
      ],
      afterFiles: [
        // Student app routes (default)
        {
          source: '/:path*',
          destination: '/apps/students/:path*',
        },
      ],
    };
  },

  // Configure redirects
  async redirects() {
    return [
      // Add any necessary redirects here
    ];
  },

  // Transpile packages if needed
  transpilePackages: ['@clerk/nextjs'],
  
  // Image configuration
  images: {
    domains: ['unpuzzle.b-cdn.net'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'unpuzzle.b-cdn.net',
        pathname: '/**',
      },
    ],
  },

  // Webpack configuration
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@students': '/apps/students',
      '@instructor': '/apps/instructor',
    };
    return config;
  },
};

module.exports = nextConfig;