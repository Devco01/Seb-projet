// @ts-check
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Début de la migration vers PostgreSQL...');

  try {
    // Création des paramètres initiaux de l'entreprise
    const params = await prisma.parametres.upsert({
      where: { id: 1 },
      update: {},
      create: {
        companyName: 'Mon Entreprise',
        address: '1 rue de l\'exemple',
        zipCode: '75000',
        city: 'Paris',
        email: 'contact@exemple.fr',
        phone: '01 23 45 67 89',
        paymentDelay: 30,
        prefixeDevis: 'D-',
        prefixeFacture: 'F-',
        conditionsPaiement: 'Paiement à 30 jours'
      },
    });

    console.log('Paramètres initialisés:', params);

    // Création d'un client exemple
    const client = await prisma.client.upsert({
      where: { id: 1 },
      update: {},
      create: {
        nom: 'Client Exemple',
        email: 'client@exemple.fr',
        telephone: '01 98 76 54 32',
        adresse: '123 avenue test',
        codePostal: '75001',
        ville: 'Paris',
        pays: 'France',
        contact: 'Jean Dupont'
      },
    });

    console.log('Client exemple créé:', client);

    console.log('Migration terminée avec succès !');
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 