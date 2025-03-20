import { PrismaClient, Prisma } from '@prisma/client';

// Vérifier si nous sommes en phase de build
const isBuild = process.env.NODE_ENV === 'production' && process.argv.includes('build');

// Déclaration pour améliorer TypeScript avec globalThis
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Configuration du client Prisma
const prismaOptions: Prisma.PrismaClientOptions = {
  log: [
    { level: 'error', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' }
  ],
};

// Fonction pour créer ou obtenir l'instance Prisma
function getPrismaInstance() {
  // Pendant la phase de build, renvoyer un objet vide pour éviter les erreurs de validation
  if (isBuild) {
    console.log('🔨 Phase de build: utilisation d\'un client Prisma factice');
    return {} as unknown as PrismaClient;
  }

  // En développement, réutiliser l'instance existante
  if (process.env.NODE_ENV === 'development') {
    if (!globalThis.prisma) {
      globalThis.prisma = new PrismaClient(prismaOptions);
    }
    return globalThis.prisma;
  }

  // En production, créer une nouvelle instance
  return new PrismaClient(prismaOptions);
}

// Exporter l'instance
export const prisma = getPrismaInstance();
