import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/clients - Récupérer tous les clients
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        nom: 'asc',
      },
    });
    
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
    
    // Validation des données
    if (!data.nom || !data.email || !data.adresse || !data.codePostal || !data.ville) {
      return NextResponse.json(
        { error: 'Les champs nom, email, adresse, code postal et ville sont obligatoires' },
        { status: 400 }
      );
    }
    
    const client = await prisma.client.create({
      data: {
        nom: data.nom,
        contact: data.contact,
        email: data.email,
        telephone: data.telephone,
        adresse: data.adresse,
        codePostal: data.codePostal,
        ville: data.ville,
        pays: data.pays || 'France',
        siret: data.siret,
        tva: data.tva,
        notes: data.notes,
      },
    });
    
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du client' },
      { status: 500 }
    );
  }
} 