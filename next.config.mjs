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
  },
};

export default nextConfig;

 