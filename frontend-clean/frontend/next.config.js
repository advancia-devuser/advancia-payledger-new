const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,

  typescript: {
    ignoreBuildErrors: false,
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    NEXT_PUBLIC_SOCKET_URL:
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000",
  },

  // Output as standalone for production (not static export)
  output: "standalone",

  // Image optimization settings
  images: {
    unoptimized: true,
  },

  // Fix chunk loading issues
  webpack: (config, { dev, isServer }) => {
    if (!isServer && dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },

  // Remove invalid experimental options
  experimental: {
    // Remove appDir as it's now stable in Next.js 14
  },
};

module.exports = nextConfig;
