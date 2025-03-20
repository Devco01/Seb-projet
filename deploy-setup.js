// Script de préparation pour le déploiement
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Préparation du déploiement...');

// Assurer que le répertoire uploads existe
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  console.log('📁 Création du répertoire uploads...');
  fs.mkdirSync(uploadsDir, { recursive: true });
  fs.writeFileSync(path.join(uploadsDir, '.gitkeep'), '');
}

// Assurer que le répertoire img existe et contient le placeholder du logo
const imgDir = path.join(process.cwd(), 'public', 'img');
if (!fs.existsSync(imgDir)) {
  console.log('📁 Création du répertoire img...');
  fs.mkdirSync(imgDir, { recursive: true });
}

// Créer l'image placeholder
const logoPlaceholderPath = path.join(imgDir, 'logo-placeholder.png');
if (!fs.existsSync(logoPlaceholderPath)) {
  console.log('🖼️ Création de l\'image placeholder du logo...');
  // Base64 d'une petite image PNG (1x1 pixel transparent)
  const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const imageBuffer = Buffer.from(base64Image, 'base64');
  fs.writeFileSync(logoPlaceholderPath, imageBuffer);
}

// Vérifier si le fichier .env existe
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('📄 Création du fichier .env...');
  fs.writeFileSync(
    envPath,
    `PORT=3001
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=supersecretkey123456789supersecretkey
NODE_ENV=development
`
  );
}

// S'assurer que le répertoire prisma existe
const prismaDir = path.join(process.cwd(), 'prisma');
if (!fs.existsSync(prismaDir)) {
  console.log('📁 Création du répertoire prisma...');
  fs.mkdirSync(prismaDir, { recursive: true });
}

// Vérifier que le schéma Prisma est correct
const schemaPath = path.join(prismaDir, 'schema.prisma');
const schemaContent = `// This is your Prisma schema file
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// Modèle pour les clients
model Client {
  id         Int       @id @default(autoincrement())
  nom        String
  contact    String?
  email      String
  telephone  String?
  adresse    String
  codePostal String
  ville      String
  pays       String    @default("France")
  siret      String?
  tva        String?
  notes      String?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  devis      Devis[]
  factures   Facture[]
  paiements  Paiement[]
}

// Modèle pour les devis
model Devis {
  id         Int       @id @default(autoincrement())
  numero     String    @unique
  clientId   Int
  client     Client    @relation(fields: [clientId], references: [id])
  date       DateTime
  validite   DateTime
  statut     String    @default("En attente") // En attente, Accepté, Refusé, Expiré
  lignes     String    // Stocké comme JSON sous forme de texte
  conditions String?
  notes      String?
  totalHT    Float
  totalTTC   Float
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  factures   Facture[]
}

// Modèle pour les factures
model Facture {
  id          Int       @id @default(autoincrement())
  numero      String    @unique
  clientId    Int
  client      Client    @relation(fields: [clientId], references: [id])
  devisId     Int?
  devis       Devis?    @relation(fields: [devisId], references: [id])
  date        DateTime
  echeance    DateTime
  statut      String    @default("En attente") // En attente, Payée, Retard, Annulée
  lignes      String    // Stocké comme JSON sous forme de texte
  conditions  String?
  notes       String?
  totalHT     Float
  totalTTC    Float
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  paiements   Paiement[]
}

// Modèle pour les paiements
model Paiement {
  id                  Int       @id @default(autoincrement())
  reference           String    @unique
  factureId           Int
  facture             Facture   @relation(fields: [factureId], references: [id])
  clientId            Int
  client              Client    @relation(fields: [clientId], references: [id])
  date                DateTime
  montant             Float
  methode             String    // Virement, Chèque, Espèces, Carte bancaire, Prélèvement
  referenceTransaction String?
  statut              String    @default("En attente") // En attente, Reçu
  notes               String?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

// Modèle pour les paramètres de l'entreprise
model Parametres {
  id                Int       @id @default(autoincrement())
  nomEntreprise     String
  adresse           String
  codePostal        String
  ville             String
  telephone         String?
  email             String
  siret             String?
  tva               String?
  logo              String?   // Chemin vers le logo stocké
  prefixeDevis      String    @default("D-")
  prefixeFacture    String    @default("F-")
  conditionsPaiement String?
  mentionsTVA       String?
  textePiedPage     String?
  emailExpediteur   String?
  objetDevis        String?
  objetFacture      String?
  messageDevis      String?
  messageFacture    String?
  iban              String?
  bic               String?
  nomBanque         String?
  titulaire         String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
`;

fs.writeFileSync(schemaPath, schemaContent);
console.log('📝 Schéma Prisma mis à jour');

// Mettre à jour le fichier prisma.ts
const prismaTsPath = path.join(process.cwd(), 'src', 'lib', 'prisma.ts');
const prismaTsContent = `import { PrismaClient } from '@prisma/client';
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
        url: process.env.DATABASE_URL || \`file:\${path.resolve('./prisma/dev.db')}\`,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
`;

// S'assurer que le répertoire lib existe
const libDir = path.join(process.cwd(), 'src', 'lib');
if (!fs.existsSync(libDir)) {
  console.log('📁 Création du répertoire lib...');
  fs.mkdirSync(libDir, { recursive: true });
}

fs.writeFileSync(prismaTsPath, prismaTsContent);
console.log('📝 Client Prisma mis à jour');

// Génération du client Prisma
try {
  console.log('🔨 Génération du client Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Erreur lors de la génération du client Prisma:', error);
}

console.log('✅ Préparation terminée avec succès!');
console.log('🚀 Vous pouvez maintenant déployer votre application:');
console.log('  git add .');
console.log('  git commit -m "Préparation pour le déploiement"');
console.log('  git push'); 