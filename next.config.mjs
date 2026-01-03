/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict mode: catches common React mistakes and issues during development
  reactStrictMode: true,

  // TypeScript configuration
  typescript: {
    // Set to false in production for stricter type checking
    ignoreBuildErrors: process.env.NEXT_IGNORE_TYPE_ERRORS === 'true',
  },

  // Image optimization
  images: {
    // Disable optimization for static export or simple deployments
    unoptimized: true,
    // Domains for remote images (if needed)
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },

  // Fast refresh and hot module reloading configuration
  onDemandEntries: {
    // Revalidate pages after 1 hour of inactivity
    maxInactiveAge: 60 * 60 * 1000,
    // Keep 5 pages in memory
    pagesBufferLength: 5,
  },

  // Experimental features for performance
  experimental: {
    // Enable optimized package imports (Next.js 13+)
    optimizePackageImports: ['@radix-ui/react-*', 'lucide-react'],
  },

  // Header configuration for security and caching
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ]
  },

  // Rewrites to proxy media requests to Django backend
  rewrites: async () => {
    return [
      {
        source: '/media/:path*',
        destination: 'http://127.0.0.1:8000/media/:path*',
      },
    ]
  },

  // Environment variables prefix for client-side
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },

  // Logging configuration
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Webpack configuration for custom loaders if needed
  webpack: (config, { isServer }) => {
    return config
  },

  // Turbopack configuration for Next.js 16+
  turbopack: {},
}
