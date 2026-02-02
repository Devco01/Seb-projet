/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  turbopack: {
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: "./tsconfig.json"
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  trailingSlash: true,
  distDir: '.next',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

module.exports = nextConfig;

 