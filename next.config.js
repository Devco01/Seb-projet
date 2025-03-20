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
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
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

 