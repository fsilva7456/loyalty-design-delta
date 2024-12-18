/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add preferRelative option to module resolution
    config.resolve.preferRelative = true;

    // Handle browser-specific modules for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        http: false,
        https: false,
        debug: false,
        util: false
      };
    }

    return config;
  },
};

module.exports = nextConfig;
