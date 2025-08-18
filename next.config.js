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

module.exports = nextConfig;
