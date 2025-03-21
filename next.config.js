/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Production build should pass type checks
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  env: {
    // In production, ensure these are correctly set
    DEMO_MODE: process.env.DEMO_MODE || "0",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "https://www.utechlab.net/",
  },
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
