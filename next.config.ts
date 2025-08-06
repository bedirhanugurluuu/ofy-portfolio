import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost"], // backend resim sunucusunun domaini
  },
};

export default nextConfig;
