/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'api.siteniz.com', 'cdn.siteniz.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Completely exclude admin-panel from build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: /admin-panel/,
    };
    
    // Exclude admin-panel from module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      'admin-panel': false,
    };
    
    return config;
  },
  // Exclude admin-panel from build
  experimental: {
    excludeDefaultMomentLocales: false,
  },
};

module.exports = nextConfig;
