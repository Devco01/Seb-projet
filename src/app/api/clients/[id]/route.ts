import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: {
    id: string;
  };
};

// GET /api/clients/[id] - Récupérer un client spécifique
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de client invalide' },
        { status: 400 }
      );
    }
    
    const client = await prisma.client.findUnique({
      where: { id }
    });
    
    if (!client) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(client);
  } catch (error) {
    console.error('Erreur lors de la récupération du client:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du client' },
      { status: 500 }
    );
  }
}

// PUT /api/clients/[id] - Mettre à jour un client
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de client invalide' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    
    // Validation des données
    if (!data.nom || !data.email) {
      return NextResponse.json(
        { error: 'Les champs nom et email sont obligatoires' },
        { status: 400 }
      );
    }
    
    // Vérifier si le client existe
    const existingClient = await prisma.client.findUnique({
      where: { id },
    });
    
    if (!existingClient) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }
    
    // Préparer les données avec des valeurs par défaut pour les champs manquants
    const updateData = {
      nom: data.nom,
      email: data.email,
      contact: data.contact || null,
      telephone: data.telephone || null,
      adresse: data.adresse || existingClient.adresse,
      codePostal: data.codePostal || existingClient.codePostal,
      ville: data.ville || existingClient.ville,
      pays: data.pays || existingClient.pays,
      siret: data.siret || null,
      tva: data.tva || null,
      notes: data.notes || null,
    };
    
    // Mettre à jour le client
    const updatedClient = await prisma.client.update({
      where: { id },
      data: updateData,
    });
    
    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du client:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du client' },
      { status: 500 }
    );
  }
}

// DELETE /api/clients/[id] - Supprimer un client
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de client invalide' },
        { status: 400 }
      );
    }
    
    // Vérifier si le client existe
    const existingClient = await prisma.client.findUnique({
      where: { id }
    });
    
    if (!existingClient) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }
    
    try {
      // Supprimer le client directement
      await prisma.client.delete({
        where: { id },
      });
      
      return NextResponse.json({ success: true });
    } catch (deleteError) {
      console.error('Erreur de suppression (probablement des relations):', deleteError);
      return NextResponse.json(
        { error: 'Impossible de supprimer ce client car il possède des devis, factures ou paiements associés' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du client' },
      { status: 500 }
    );
  }
} 