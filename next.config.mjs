/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Désactiver les vérifications ESLint pendant la construction
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Désactiver les vérifications TypeScript pendant la construction
    ignoreBuildErrors: true,
  },
  compress: false,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Augmenter les timeouts pour les fonctions serverless
  serverRuntimeConfig: {
    maxDuration: 60, // 60 secondes
  },
  // Désactiver le minifieur pour faciliter le débogage
  swcMinify: false,
};

export default nextConfig;

 