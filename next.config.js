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
    // Ignore admin-panel directory during build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: /admin-panel/,
    };
    return config;
  },
};

module.exports = nextConfig;
