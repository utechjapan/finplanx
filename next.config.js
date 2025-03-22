/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // For production, set to true to avoid build errors
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Environment variables
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 
                 (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE || "false",
  },
  
  // Set to serverless for Vercel compatibility
  output: 'standalone',
  
  // We want the URL to point to real functions, not rewrite
  trailingSlash: false,
  
  // Disable experimental features that might cause issues
  experimental: {
    serverActions: false,
  }
};

module.exports = nextConfig;