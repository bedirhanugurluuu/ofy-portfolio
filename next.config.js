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
    
    return config;
  },

};

module.exports = withBundleAnalyzer(nextConfig);
