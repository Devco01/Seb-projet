/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    // Suppression de l'option obsolète
    // serverExternalPackages: ['@prisma/client'],
  },
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: "./tsconfig.json"
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  trailingSlash: true,
  distDir: '.next',
  images: {
    domains: [
      'localhost', 
      'uqrfexlvdhctmpfewzbj.blob.vercel-storage.com',
      'res.cloudinary.com'
    ],
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
  // Configuration explicite du port
  serverRuntimeConfig: {
    PORT: 3001
  },
  publicRuntimeConfig: {
    PORT: 3001
  },
  // Suppression de la configuration obsolète
  // devServer: {
  //   port: 3001
  // }
};

module.exports = nextConfig;

 