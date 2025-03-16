import { PrismaClient } from '@prisma/client';

// Éviter de créer plusieurs instances de Prisma Client en développement
// https://www.prisma.io/docs/guides/performance-and-optimization/connection-management

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 