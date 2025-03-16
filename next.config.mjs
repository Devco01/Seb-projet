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
  // Configuration minimale pour Vercel
  output: 'standalone',
  
  // Désactiver la compression pour éviter les problèmes de rendu
  compress: false,
  
  // Optimiser le chargement des styles
  optimizeFonts: true,
  
  // Augmenter le délai d'expiration pour les requêtes
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Configurer les en-têtes pour améliorer le chargement des ressources
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

 