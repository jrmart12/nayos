import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    formats: ['image/avif', 'image/webp'],
    qualities: [100, 75],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.housekitchenhn.com',
          },
        ],
        destination: 'https://housekitchenhn.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
