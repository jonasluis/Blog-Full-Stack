import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    return [
        {
            source: '/blog',
            destination: `http://localhost:4444/blog`,
        },
    ];
}
};

export default nextConfig;
