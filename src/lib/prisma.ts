import { PrismaClient } from '@prisma/client';

// Déclaration pour améliorer TypeScript avec globalThis
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Garde une instance unique de Prisma Client en développement pour éviter plusieurs instances
export const prisma = global.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
  datasources: {
    db: {
      // Force l'URL de la base de données pour Vercel
      url: process.env.NODE_ENV === 'production' 
        ? process.env.DATABASE_URL 
        : "file:./prisma/dev.db"
    },
  },
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
