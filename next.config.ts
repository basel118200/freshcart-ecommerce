import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ecommerce.routemisr.com",
      },
      {
        protocol: "https",
        hostname: "freshcart-route.vercel.app",
      },
    ],
  },
};

export default nextConfig;
