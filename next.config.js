/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Completely ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Environment variables
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "https://www.utechlab.net",
    NEXT_PUBLIC_DEMO_MODE: process.env.NODE_ENV === "production" ? "false" : "true",
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/api/auth/signin',
        destination: '/login',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
