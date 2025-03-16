import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/clients - Récupérer tous les clients
export async function GET() {
  try {
    console.log('Tentative de récupération des clients...');
    console.log('URL de la base de données:', process.env.DATABASE_URL);
    
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
    
    // Validation des données
    if (!data.nom || !data.email || !data.adresse || !data.codePostal || !data.ville) {
      return NextResponse.json(
        { error: 'Les champs nom, email, adresse, code postal et ville sont obligatoires' },
        { status: 400 }
      );
    }
    
    // Créer le client avec les champs du schéma Prisma
    const client = await prisma.client.create({
      data: {
        nom: data.nom,
        email: data.email,
        telephone: data.telephone,
        adresse: data.adresse,
        codePostal: data.codePostal,
        ville: data.ville,
        pays: data.pays || 'France',
        notes: data.notes,
        // Ajouter ces champs s'ils existent dans votre schéma
        ...(data.contact && { contact: data.contact }),
        ...(data.siret && { siret: data.siret }),
        ...(data.tva && { tva: data.tva }),
      },
    });
    
    console.log('Client créé avec succès:', client);
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Erreur détaillée lors de la création du client:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du client' },
      { status: 500 }
    );
  }
} 