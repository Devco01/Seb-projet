import { PrismaClient, Prisma } from '@prisma/client';

// Déclaration pour améliorer TypeScript avec globalThis
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// IMPORTANT: Configuration spéciale pour le build Vercel
const isBuildTime = process.env.NODE_ENV === 'production' && process.argv.includes('build');

// Fonction pour obtenir l'URL de la base de données
function getDatabaseUrl() {
  // Si on est en phase de build et que la variable n'est pas définie, utiliser une URL factice
  if (isBuildTime && (!process.env.POSTGRES_URL && !process.env.DATABASE_URL)) {
    console.warn('ATTENTION: Phase de build sans variables d\'environnement, utilisation d\'une URL factice');
    return 'postgresql://fakebuild:fakebuild@localhost:5432/fakebuild';
  }
  
  // En temps normal, utiliser l'URL réelle
  return process.env.POSTGRES_URL || process.env.DATABASE_URL;
}

// Vérification des variables d'environnement requises
const databaseUrl = getDatabaseUrl();

if (!databaseUrl && !isBuildTime) {
  console.error('ERREUR: La variable d\'environnement POSTGRES_URL ou DATABASE_URL est requise mais non définie.');
  // En production, on ne veut pas arrêter le processus mais afficher clairement l'erreur
  if (process.env.NODE_ENV === 'development') {
    throw new Error('La variable d\'environnement de base de données est requise');
  }
}

// Configuration du client Prisma
const globalOptions: Prisma.PrismaClientOptions = {
  log: [
    { level: 'error', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' }
  ],
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
};

// Déclarer la variable prisma
let prismaClient;

// Pour éviter l'erreur de validation pendant la phase de build
if (isBuildTime) {
  console.log('Phase de build: Création d\'un client Prisma sans connexion');
  prismaClient = undefined as unknown as PrismaClient;
} else {
  // Garde une instance unique de Prisma Client en développement
  prismaClient = globalThis.prisma || new PrismaClient(globalOptions);
  
  // Sauvegarde de l'instance pour le développement
  if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prismaClient;
  }
}

// Exporter l'instance
export const prisma = prismaClient;
