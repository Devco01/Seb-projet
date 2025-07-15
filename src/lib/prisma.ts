import { PrismaClient } from '@prisma/client';
import path from 'path';

// Éviter de créer plusieurs instances de Prisma Client en développement
// https://www.prisma.io/docs/guides/performance-and-optimization/connection-management

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Utilisation de la variable d'environnement pour SQLite
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL || `file:${path.resolve('./prisma/dev.db')}`,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
