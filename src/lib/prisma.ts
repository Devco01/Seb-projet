import { PrismaClient, Prisma } from '@prisma/client';

// Vérifier si nous sommes en phase de build
const isBuild = process.env.NODE_ENV === 'production' && process.argv.includes('build');

// Vérifie si nous sommes en mode sans base de données (développement ou production)
const isSkipDb = process.env.SKIP_DB === 'true';

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
  // Vérifier si nous avons une URL de base de données
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  
  // Si mode sans BDD, phase de build, ou URL manquante en développement, renvoyer un objet mock
  if (isSkipDb || isBuild || (!databaseUrl && process.env.NODE_ENV === 'development')) {
    console.log('🔨 Mode mock: utilisation d\'un client Prisma factice');
    // Renvoyer un mock qui renvoie des tableaux vides pour findMany
    return {
      facture: {
        findMany: () => Promise.resolve([]),
        findUnique: () => Promise.resolve(null),
        create: () => Promise.resolve({}),
      },
      client: {
        findMany: () => Promise.resolve([]),
        findUnique: () => Promise.resolve(null),
      },
      devis: {
        findMany: () => Promise.resolve([]),
        findUnique: () => Promise.resolve(null),
      },
      paiement: {
        findMany: () => Promise.resolve([]),
        findUnique: () => Promise.resolve(null),
      },
    } as unknown as PrismaClient;
  }

  // En développement avec URL valide, réutiliser l'instance existante
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
