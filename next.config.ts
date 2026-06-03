import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com/**",
      },
    ],
  },
  output: "standalone",
  // Tree-shake icon/animation/chart packages — only import used members
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "recharts",
      "@stripe/react-stripe-js",
    ],
  },
};

export default nextConfig;
