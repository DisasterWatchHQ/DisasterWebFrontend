/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', process.env.NEXT_PRIVATE_API_URL 
      ? process.env.NEXT_PRIVATE_API_URL.replace(/^https?:\/\//, '') 
      : undefined
    ].filter(Boolean),
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      process.env.NEXT_PUBLIC_API_URL 
      ? {
          protocol: 'https',
          hostname: process.env.NEXT_PRIVATE_API_URL.replace(/^https?:\/\//, ''),
          pathname: '/uploads/**',
        }
      : null
    ].filter(Boolean),
  },
  // Enable production optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Configure headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;