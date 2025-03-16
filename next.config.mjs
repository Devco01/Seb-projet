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
  
  // Activer la génération statique pour améliorer les performances
  output: 'export',
  
  // Désactiver la compression pour éviter les problèmes de rendu
  compress: false,
  
  // Configurer les packages externes pour les composants serveur
  serverExternalPackages: ['@prisma/client'],
  
  // Désactiver les images optimisées pour le déploiement statique
  images: {
    unoptimized: true,
  },
  
  // Désactiver le middleware pour le déploiement statique
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
  
  // Configurer les en-têtes pour améliorer le chargement des ressources
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

 