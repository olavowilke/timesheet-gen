/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress @react-pdf/renderer canvas peer-dep warning during build
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
