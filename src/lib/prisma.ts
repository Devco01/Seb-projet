import { PrismaClient } from '@prisma/client';

// Éviter les instances multiples de PrismaClient en développement
// https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices

const prismaClientSingleton = () => {
  console.log('Initialisation du client Prisma...');
  try {
    return new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'pretty',
    });
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du client Prisma:', error);
    throw error;
  }
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// Test de connexion initial
try {
  console.log('Test de connexion à la base de données...');
  prisma.$connect().then(() => {
    console.log('Connexion à la base de données réussie!');
  }).catch((error: any) => {
    console.error('Erreur de connexion à la base de données:', error);
  });
} catch (error: any) {
  console.error('Erreur lors du test de connexion:', error);
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 