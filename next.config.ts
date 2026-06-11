import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "static.exercisedb.dev" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "v2.exercisedb.io" },
      { protocol: "https", hostname: "edb-4rme8.ondigitalocean.app" },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
