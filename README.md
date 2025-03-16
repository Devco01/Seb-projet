# FacturePro - Application de facturation pour entreprise de peinture

Cette application permet de gérer les clients, devis, factures et paiements pour une entreprise de peinture en bâtiment.

## Fonctionnalités

- Gestion des clients
- Création et suivi des devis
- Génération de factures
- Suivi des paiements
- Tableau de bord avec statistiques

## Technologies utilisées

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL (Neon)
- Vercel (déploiement)

## Installation locale

1. Cloner le dépôt
   ```bash
   git clone https://github.com/votre-utilisateur/seb-projet.git
   cd seb-projet
   ```

2. Installer les dépendances
   ```bash
   npm install
   ```

3. Configurer les variables d'environnement
   ```bash
   cp .env.example .env
   # Modifier les valeurs dans le fichier .env
   ```

4. Générer le client Prisma
   ```bash
   npx prisma generate
   ```

5. Lancer le serveur de développement
   ```bash
   npm run dev
   ```

## Déploiement sur Vercel

### Prérequis

- Un compte Vercel
- Un compte Neon pour la base de données PostgreSQL

### Étapes de déploiement

1. Créer une base de données PostgreSQL sur Neon
   - Notez l'URL de connexion fournie

2. Importer le projet sur Vercel
   - Connectez votre dépôt GitHub
   - Configurez les variables d'environnement :
     - `DATABASE_URL` : URL de connexion à votre base de données Neon
     - `JWT_SECRET` : Une chaîne aléatoire pour sécuriser les JWT

3. Déployer l'application
   - Vercel déploiera automatiquement l'application

### Résolution des problèmes courants

#### Erreur SSL (PR_END_OF_FILE_ERROR)

Si vous rencontrez cette erreur :

1. Vérifiez que l'URL de la base de données est correcte et inclut `?sslmode=require`
2. Essayez d'accéder directement à `/accueil` ou `/diagnostic` pour contourner la page d'accueil
3. Vérifiez les logs Vercel pour identifier les erreurs spécifiques

## Maintenance

### Mise à jour des dépendances

```bash
npm update
```

### Migration de la base de données

```bash
npx prisma migrate dev --name nom-de-la-migration
```

## Licence

Ce projet est sous licence privée. Tous droits réservés.
