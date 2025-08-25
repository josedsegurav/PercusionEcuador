import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lhjqtjajlkefyowwdcdw.supabase.co",
      },
    ],
  },
};

export default nextConfig;
