/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ignore TypeScript errors during build for now
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // Only use this option temporarily, then fix the types.
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors during build for now
  eslint: {
    // Disable checking for ESLint errors during builds
    ignoreDuringBuilds: true,
  },
  // Enable this if your app has environment variables needed at build time
  env: {
    DEMO_MODE: process.env.DEMO_MODE || process.env.NODE_ENV !== 'production' ? '1' : '0',
  },
  // Add support for custom redirects
  async redirects() {
    return [
      // Redirect to dashboard after login
      {
        source: '/api/auth/signin',
        destination: '/login',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;