import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🚀 Initialisation de la base de données...');

    // Créer les paramètres par défaut
    const parametres = await prisma.parametres.upsert({
      where: { id: 1 },
      update: {},
      create: {
        companyName: 'Ma Société',
        email: 'contact@masociete.com',
        paymentDelay: 30,
        prefixeDevis: 'DEV',
        prefixeFacture: 'FAC',
        logo: null,
        address: '',
        zipCode: '',
        city: '',
        phone: '',
        siret: '',
        tvaNumber: '',
        tvaRate: 20,
        paymentMethods: ['Virement bancaire'],
        paymentTerms: 'Paiement à 30 jours',
        notes: '',
        footerText: '',
        headerText: '',
        invoiceTemplate: 'default',
        quoteTemplate: 'default',
        language: 'fr',
        currency: 'EUR',
        dateFormat: 'DD/MM/YYYY',
        timezone: 'Europe/Paris',
        theme: 'light',
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        autoBackup: true,
        backupFrequency: 'daily',
        lastBackup: null,
        maintenanceMode: false,
        apiKey: null,
        apiEnabled: false,
        apiRateLimit: 100,
        apiRequests: 0,
        apiLastReset: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('✅ Base de données initialisée avec succès !');
    console.log('📊 Paramètres créés :', parametres);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données :', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 