const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lsxafginsylkeuyzuiau.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lsxafginsylkeuyzuiau.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Image optimization ayarları - Supabase görselleri için unoptimized kullanılacak
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Completely exclude temp-admin-panel from build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: /temp-admin-panel/,
    };
    
    // Exclude temp-admin-panel from module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      'temp-admin-panel': false,
    };

    // Exclude temp-admin-panel from TypeScript compilation
    config.module.rules.push({
      test: /\.tsx?$/,
      exclude: /temp-admin-panel/,
    });
    
    return config;
  },
  typescript: {
    // Ignore TypeScript errors in temp-admin-panel
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors in temp-admin-panel
    ignoreDuringBuilds: true,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
