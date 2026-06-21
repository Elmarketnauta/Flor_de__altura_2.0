/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/mobile/**', '**/.next/**', '**/node_modules/**'],
    };
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    unoptimized: false, // Enable Next.js Image Optimization
  },
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  swcMinify: true,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
    ],
  },
};

export default nextConfig;
