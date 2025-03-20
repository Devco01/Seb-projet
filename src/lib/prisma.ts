import { PrismaClient, Prisma } from '@prisma/client';

// Déclaration pour améliorer TypeScript avec globalThis
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Vérification des variables d'environnement requises
const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('ERREUR: La variable d\'environnement POSTGRES_URL ou DATABASE_URL est requise mais non définie.');
  // En production, on ne veut pas arrêter le processus mais afficher clairement l'erreur
  if (process.env.NODE_ENV === 'development') {
    throw new Error('La variable d\'environnement de base de données est requise');
  }
}

// Configuration du client Prisma
const globalOptions: Prisma.PrismaClientOptions = {
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' }
  ],
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
};

// Garde une instance unique de Prisma Client en développement
export const prisma = globalThis.prisma || new PrismaClient(globalOptions);

// Sauvegarde de l'instance pour le développement
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
