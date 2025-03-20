import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    
    console.log('Clients récupérés:', clients.length);
    return NextResponse.json(clients);
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
    
    // Validation des données minimales
    if (!data.nom || !data.email) {
      return NextResponse.json(
        { error: 'Les champs nom et email sont obligatoires' },
        { status: 400 }
      );
    }
    
    // Créer des données Prisma simplifiées
    const prismaData = {
      nom: data.nom,
      email: data.email,
      telephone: data.telephone || null,
      adresse: data.adresse || '',
      codePostal: data.codePostal || '',
      ville: data.ville || '',
      pays: data.pays || 'France',
    };
    
    try {
      // Créer le client avec les champs du schéma Prisma
      const client = await prisma.client.create({
        data: prismaData
      });
      
      console.log('Client créé avec succès:', client);
      return NextResponse.json(client, { status: 201 });
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