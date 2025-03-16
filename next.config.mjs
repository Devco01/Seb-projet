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
  // Activer la compression pour améliorer les performances
  compress: true,
  // Configuration pour les assets statiques
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
  // Désactiver le minifieur pour faciliter le débogage
  swcMinify: false,
  // Configuration pour les images
  images: {
    domains: [],
    unoptimized: true,
  },
  // Configuration pour le serveur
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
  // Configuration pour l'output
  output: 'standalone',
};

export default nextConfig;

 