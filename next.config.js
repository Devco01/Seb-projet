/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  trailingSlash: true,
  distDir: '.next',
  webpack: (config) => {
    return config;
  }
};

 