import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,

  experimental: {
    // Tree-shake these packages — only the exports actually used get bundled
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "framer-motion",
      "react-datepicker",
    ],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
