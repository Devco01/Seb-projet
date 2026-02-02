import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/clients/[id] - Récupérer un client spécifique
export async function GET(request: NextRequest, props: RouteParams) {
  const params = await props.params;
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
          orderBy: { createdAt: 'desc' }
        },
        factures: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!client) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }

    console.log(`Client ${id} récupéré avec ${client.devis?.length || 0} devis et ${client.factures?.length || 0} factures`);
    console.log('Devis:', client.devis);
    console.log('Factures:', client.factures);
    
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
export async function PUT(request: NextRequest, props: RouteParams) {
  const params = await props.params;
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
export async function DELETE(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  try {
    const id = parseInt(params.id);
    console.log(`Tentative de suppression du client avec ID: ${id}`);
    
    if (isNaN(id)) {
      console.error(`ID de client invalide: ${params.id}`);
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
        paiements: true
      }
    });
    
    if (!existingClient) {
      console.error(`Client non trouvé avec ID: ${id}`);
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier si le client a des relations qui empêcheraient sa suppression
    if (existingClient.devis.length > 0 || existingClient.factures.length > 0 || existingClient.paiements.length > 0) {
      console.error(`Impossible de supprimer le client ID ${id} car il a des relations:`, {
        nbDevis: existingClient.devis.length,
        nbFactures: existingClient.factures.length,
        nbPaiements: existingClient.paiements.length
      });
      
      return NextResponse.json(
        { 
          error: 'Impossible de supprimer ce client car il possède des devis, factures ou paiements associés',
          details: {
            devis: existingClient.devis.length,
            factures: existingClient.factures.length,
            paiements: existingClient.paiements.length
          }
        },
        { status: 400 }
      );
    }
    
    try {
      // Supprimer le client
      await prisma.client.delete({
        where: { id },
      });
      
      console.log(`Client ID ${id} supprimé avec succès`);
      return NextResponse.json({ success: true, message: 'Client supprimé avec succès' });
    } catch (deleteError) {
      console.error(`Erreur lors de la suppression du client ID ${id}:`, deleteError);
      
      // Afficher plus de détails sur l'erreur Prisma
      if (deleteError.code) {
        console.error(`Code d'erreur Prisma: ${deleteError.code}`);
      }
      
      if (deleteError.meta) {
        console.error('Métadonnées d\'erreur:', deleteError.meta);
      }
      
      return NextResponse.json(
        { 
          error: 'Impossible de supprimer ce client',
          details: deleteError.message 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du client', details: error.message },
      { status: 500 }
    );
  }
} 