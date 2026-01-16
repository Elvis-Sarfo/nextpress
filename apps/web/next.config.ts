import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@cms/kernel', '@cms/prisma-adapter'],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
