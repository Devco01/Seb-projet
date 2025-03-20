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
  // Si mode sans BDD ou phase de build, renvoyer un objet mock
  if (isSkipDb || isBuild) {
    console.log('🔨 Mode mock: utilisation d\'un client Prisma factice');
    return {} as unknown as PrismaClient;
  }

  // Vérifier si nous avons une URL de base de données
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!databaseUrl && !isSkipDb && !isBuild) {
    console.error('❌ ERREUR: Aucune URL de base de données trouvée dans les variables d\'environnement');
    console.info('💡 TIP: Ajoutez SKIP_DB=true dans le fichier .env pour développer sans base de données');
    throw new Error('URL de base de données manquante');
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
