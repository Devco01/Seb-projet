import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/clients/[id] - Récupérer un client spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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
      where: { id },
      include: {
        devis: {
          select: {
            id: true,
            numero: true,
            date: true,
            totalTTC: true,
            statut: true,
          },
          orderBy: {
            date: 'desc',
          },
          take: 5,
        },
        factures: {
          select: {
            id: true,
            numero: true,
            date: true,
            totalTTC: true,
            statut: true,
          },
          orderBy: {
            date: 'desc',
          },
          take: 5,
        },
      },
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
  { params }: { params: { id: string } }
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
    if (!data.nom || !data.email || !data.adresse || !data.codePostal || !data.ville) {
      return NextResponse.json(
        { error: 'Les champs nom, email, adresse, code postal et ville sont obligatoires' },
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
    
    // Mettre à jour le client
    const updatedClient = await prisma.client.update({
      where: { id },
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
  { params }: { params: { id: string } }
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
      where: { id },
      include: {
        devis: true,
        factures: true,
        paiements: true,
      },
    });
    
    if (!existingClient) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier si le client a des devis, factures ou paiements associés
    if (existingClient.devis.length > 0 || existingClient.factures.length > 0 || existingClient.paiements.length > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer un client qui a des devis, factures ou paiements associés' },
        { status: 400 }
      );
    }
    
    // Supprimer le client
    await prisma.client.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du client' },
      { status: 500 }
    );
  }
} 