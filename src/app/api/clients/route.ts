import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Type pour l'API Client
interface ClientAPI {
  id?: number;
  nom: string;
  email: string;
  telephone?: string | null;
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string;
  notes?: string | null;
  contact?: string | null;
  siret?: string | null;
  tva?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Adaptateur de Prisma vers l'API
function adaptPrismaToAPI(prismaClient: any): ClientAPI {
  return {
    id: prismaClient.id,
    nom: prismaClient.nom,
    email: prismaClient.email,
    telephone: prismaClient.telephone || null,
    adresse: prismaClient.adresse,
    codePostal: prismaClient.codePostal,
    ville: prismaClient.ville,
    pays: prismaClient.pays || 'France',
    notes: prismaClient.notes || null,
    contact: prismaClient.contact || null,
    siret: prismaClient.siret || null,
    tva: prismaClient.tva || null,
    createdAt: prismaClient.createdAt,
    updatedAt: prismaClient.updatedAt,
  };
}

// Adaptateur de l'API vers Prisma
function adaptAPIToPrisma(apiClient: any): any {
  return {
    nom: apiClient.nom,
    email: apiClient.email,
    telephone: apiClient.telephone || null,
    adresse: apiClient.adresse,
    codePostal: apiClient.codePostal,
    ville: apiClient.ville,
    pays: apiClient.pays || 'France',
    notes: apiClient.notes || null,
    contact: apiClient.contact || null,
    siret: apiClient.siret || null,
    tva: apiClient.tva || null,
  };
}

// GET /api/clients - Récupérer tous les clients
export async function GET() {
  try {
    console.log('Tentative de récupération des clients...');
    
    // Ajouter quelques clients de test si la base est vide
    const count = await prisma.client.count();
    
    if (count === 0) {
      console.log('Aucun client trouvé, création de clients de test...');
      try {
        await prisma.client.createMany({
          data: [
            {
              nom: 'Dupont Entreprise',
              email: 'contact@dupont.fr',
              telephone: '01 23 45 67 89',
              adresse: '15 rue des Lilas',
              codePostal: '75001',
              ville: 'Paris',
              contact: 'Jean Dupont',
            },
            {
              nom: 'Martin Construction',
              email: 'info@martin-construction.fr',
              telephone: '01 98 76 54 32',
              adresse: '8 avenue des Champs',
              codePostal: '69000',
              ville: 'Lyon',
              contact: 'Marie Martin',
            },
            {
              nom: 'Petit Immobilier',
              email: 'contact@petit-immo.fr',
              telephone: '03 45 67 89 10',
              adresse: '25 rue de la Paix',
              codePostal: '33000',
              ville: 'Bordeaux',
              contact: 'Sophie Petit',
            },
          ],
        });
        console.log('Clients de test créés avec succès');
      } catch (error) {
        console.error('Erreur lors de la création des clients de test:', error);
      }
    }
    
    const clients = await prisma.client.findMany({
      orderBy: {
        nom: 'asc',
      },
    });
    
    // Convertir les clients pour l'API
    const clientsAPI = clients.map(client => adaptPrismaToAPI(client));
    
    console.log('Clients récupérés:', clientsAPI.length);
    return NextResponse.json(clientsAPI);
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des clients' },
      { status: 500 }
    );
  }
}

// POST /api/clients - Créer un nouveau client
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Données reçues pour la création du client:', data);
    
    // Validation des données
    if (!data.nom || !data.email || !data.adresse || !data.codePostal || !data.ville) {
      return NextResponse.json(
        { error: 'Les champs nom, email, adresse, code postal et ville sont obligatoires' },
        { status: 400 }
      );
    }
    
    // Convertir les données pour Prisma
    const prismaData = adaptAPIToPrisma(data);
    
    try {
      // Créer le client avec les champs du schéma Prisma
      const client = await prisma.client.create({
        data: prismaData
      });
      
      // Convertir le résultat pour l'API
      const clientAPI = adaptPrismaToAPI(client);
      
      console.log('Client créé avec succès:', clientAPI);
      return NextResponse.json(clientAPI, { status: 201 });
    } catch (error) {
      console.error('Erreur prisma détaillée:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erreur détaillée lors de la création du client:', error);
    
    // Si c'est une erreur Prisma connue (comme un conflit de clé unique)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Un client avec cet email existe déjà' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de la création du client' },
      { status: 500 }
    );
  }
} 