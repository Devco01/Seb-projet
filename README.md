# 📊 Application de Facturation Pro

> Application web de facturation et gestion commerciale : clients, devis, factures, paiements et paramètres d’entreprise. Conçue pour un **usage mono-utilisateur** (un seul compte, une seule entreprise). Déploiement Vercel + base hébergée (ex. Vercel Postgres / Neon) — le dépôt reste lié au compte pour le déploiement et la BDD.

## 🚀 Fonctionnalités

### 👥 **Gestion Clients**
- Création et modification des fiches clients
- Historique complet des transactions
- Suivi des coordonnées et informations de contact

### 📋 **Devis & Factures**
- Création de devis professionnels
- Conversion automatique devis → facture
- Gestion des acomptes et factures partielles
- Suivi des statuts (brouillon, envoyé, accepté, payé)
- Numérotation automatique (DEV-2025-001, FACT-2025-001)

### 💰 **Paiements**
- Enregistrement des paiements (espèces, virement, chèque)
- Génération de reçus de paiement
- Suivi automatique des soldes

### 🎨 **Personnalisation**
- Configuration des paramètres d'entreprise
- Upload et gestion du logo
- Documents avec en-tête personnalisé
- Conditions de paiement personnalisables

### 🖨️ **Impression**
- Documents PDF professionnels
- Mise en page optimisée pour l'impression
- Logo d'entreprise intégré

## 🛠️ Technologies

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Base de données** : SQLite + Prisma ORM
- **Styles** : Tailwind CSS
- **Authentification** : NextAuth.js
- **UI** : React Icons, React Hot Toast