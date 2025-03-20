import { PrismaClient } from '@prisma/client';

// Créer une instance Prisma Client
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// Fonction principale d'initialisation
async function main() {
  try {
    console.log('🚀 Initialisation de la base de données Neon...');

    // 1. Création des paramètres par défaut
    const parametres = await prisma.parametres.upsert({
      where: { id: 1 },
      update: {},
      create: {
        companyName: 'Ma Société',
        email: 'contact@masociete.com',
        address: '',
        zipCode: '',
        city: '',
        phone: '',
        siret: '',
        paymentDelay: 30,
        logoUrl: null,
        prefixeDevis: 'DEV-',
        prefixeFacture: 'FAC-',
        mentionsLegalesDevis: 'Mentions légales devis',
        mentionsLegalesFacture: 'Mentions légales facture',
        conditionsPaiement: 'Paiement à 30 jours',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('✅ Paramètres créés avec succès :', parametres);

    // 2. Création d'un client de test
    const client = await prisma.client.upsert({
      where: { id: 1 },
      update: {},
      create: {
        nom: 'Client Test',
        email: 'client@test.com',
        adresse: 'Adresse test',
        codePostal: '75000',
        ville: 'Paris',
        pays: 'France',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('✅ Client test créé avec succès :', client);

    console.log('✅ Base de données initialisée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données :', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script d'initialisation
main()
  .then(() => console.log('✅ Script terminé avec succès'))
  .catch((error) => {
    console.error('❌ Erreur fatale :', error);
    process.exit(1);
  }); 