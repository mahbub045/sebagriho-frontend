import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.sehagriho.com',
      },
      {
        protocol: 'http',
        hostname: 'api.sehagriho.com',
      },
    ],
  },
};

export default nextConfig;