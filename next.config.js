/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // For development, these should be false to catch errors
  // For production deployment, can set to true if needed
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  
  // Environment variables
  env: {
    // Use environment variables first, with fallbacks for development
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 
                 (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
    // Demo mode should be explicitly enabled, default to "false" for production safety
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE || "false",
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/api/auth/signin',
        destination: '/login',
        permanent: true,
      }
    ];
  },

  // Image domains - add any external domains you need to load images from
  images: {
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Output to be static - this helps with certain deployment issues
  output: process.env.NEXT_OUTPUT || 'standalone',
  
  // Experimental features - 修正部分：不正なオプションを削除し、最新の形式に置き換え
  experimental: {
    // ここでは最低限必要なものだけを残す
  },
};

module.exports = nextConfig;