/** @type {import('next').NextConfig} */
const nextConfig = {
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
