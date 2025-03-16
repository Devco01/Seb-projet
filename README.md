# Application de Facturation

Une application web complète pour gérer vos devis, factures, clients et paiements.

## Fonctionnalités

- Gestion des clients
- Création et suivi des devis
- Conversion des devis en factures
- Gestion des factures
- Suivi des paiements
- Paramètres de l'entreprise personnalisables

## Technologies utilisées

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL
- Tailwind CSS

## Déploiement sur Vercel

### Prérequis

- Un compte [Vercel](https://vercel.com)
- Un compte [GitHub](https://github.com)
- Une base de données PostgreSQL (vous pouvez utiliser [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres))

### Étapes de déploiement

1. **Créer un dépôt GitHub**

   Poussez votre code sur un dépôt GitHub.

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/votre-nom/facturation.git
   git push -u origin main
   ```

2. **Connecter le projet à Vercel**

   - Connectez-vous à votre compte Vercel
   - Cliquez sur "Add New" > "Project"
   - Importez votre dépôt GitHub
   - Configurez le projet :
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: prisma generate && next build

3. **Configurer la base de données PostgreSQL**

   - Dans le tableau de bord Vercel, allez dans "Storage" > "Create" > "Postgres"
   - Suivez les instructions pour créer une nouvelle base de données
   - Une fois créée, connectez-la à votre projet

4. **Configurer les variables d'environnement**

   Dans les paramètres du projet Vercel, ajoutez les variables d'environnement suivantes :
   
   - `JWT_SECRET` : Une chaîne aléatoire longue et complexe pour sécuriser les JWT
   - Les variables de connexion à la base de données seront automatiquement ajoutées si vous utilisez Vercel Postgres

5. **Déployer**

   - Cliquez sur "Deploy"
   - Vercel va construire et déployer votre application

6. **Exécuter les migrations Prisma**

   Après le déploiement, vous devez exécuter les migrations Prisma pour créer les tables dans votre base de données :

   ```bash
   npx prisma migrate deploy
   ```

   Vous pouvez le faire via l'interface de ligne de commande Vercel ou configurer un script de déploiement.

## Développement local

1. Clonez le dépôt
2. Installez les dépendances : `npm install`
3. Copiez `.env.example` vers `.env` et configurez vos variables d'environnement
4. Exécutez les migrations Prisma : `npx prisma migrate dev`
5. Lancez le serveur de développement : `npm run dev`

## Licence

MIT
