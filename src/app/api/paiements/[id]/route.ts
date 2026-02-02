import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/paiements/[id] - Récupérer un paiement par son ID
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'ID de paiement invalide' },
        { status: 400 }
      );
    }

    const paiement = await prisma.paiement.findUnique({
      where: { id },
      include: {
        client: true,
        facture: true,
      },
    });

    if (!paiement) {
      return NextResponse.json(
        { message: 'Paiement non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(paiement);
  } catch (error) {
    console.error('Erreur lors de la récupération du paiement:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du paiement' },
      { status: 500 }
    );
  }
}

// PUT /api/paiements/[id] - Mettre à jour un paiement
export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'ID de paiement invalide' },
        { status: 400 }
      );
    }

    const data = await request.json();

    // Validation des données
    const { factureId, clientId, date, montant, methode } = data;
    if (!factureId || !clientId || !date || !montant || !methode) {
      return NextResponse.json(
        { message: 'Données invalides. FactureId, clientId, date, montant et méthode sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si le paiement existe
    const paiement = await prisma.paiement.findUnique({
      where: { id },
    });

    if (!paiement) {
      return NextResponse.json(
        { message: 'Paiement non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si la facture existe
    const facture = await prisma.facture.findUnique({
      where: { id: factureId },
    });

    if (!facture) {
      return NextResponse.json(
        { message: 'Facture non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si le client existe
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return NextResponse.json(
        { message: 'Client non trouvé' },
        { status: 404 }
      );
    }

    // Mettre à jour le paiement
    const paiementModifie = await prisma.paiement.update({
      where: { id },
      data: {
        factureId,
        clientId,
        date,
        montant: parseFloat(montant.toString()),
        methode,
        reference: data.reference,
        notes: data.notes,
      },
    });

    // Mettre à jour le statut de la facture
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/factures/${factureId}/payer`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Si la facture a changé, mettre à jour également l'ancienne facture
    if (paiement.factureId !== factureId) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/factures/${paiement.factureId}/payer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return NextResponse.json(paiementModifie);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du paiement:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du paiement' },
      { status: 500 }
    );
  }
}

// DELETE /api/paiements/[id] - Supprimer un paiement
export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const id = parseInt(params.id);
    console.log(`Tentative de suppression du paiement avec ID: ${id}`);
    
    if (isNaN(id)) {
      console.error(`ID de paiement invalide: ${params.id}`);
      return NextResponse.json(
        { message: 'ID de paiement invalide' },
        { status: 400 }
      );
    }

    // Vérifier si le paiement existe
    const paiement = await prisma.paiement.findUnique({
      where: { id },
    });

    if (!paiement) {
      console.error(`Paiement non trouvé avec ID: ${id}`);
      return NextResponse.json(
        { message: 'Paiement non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer l'ID de la facture avant de supprimer le paiement
    const factureId = paiement.factureId;
    console.log(`ID de la facture associée: ${factureId}`);

    try {
      // Supprimer le paiement
      await prisma.paiement.delete({
        where: { id },
      });
      console.log(`Paiement ID ${id} supprimé avec succès`);
    } catch (deleteError) {
      console.error(`Erreur lors de la suppression du paiement ID ${id}:`, deleteError);
      throw deleteError;
    }

    // Mettre à jour le statut de la facture
    try {
      // Construire l'URL avec une valeur par défaut si l'env n'est pas défini
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const apiUrl = baseUrl 
        ? `${baseUrl}/api/factures/${factureId}/payer` 
        : `/api/factures/${factureId}/payer`;
      
      console.log(`Mise à jour du statut de la facture via API: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error(`Erreur lors de la mise à jour du statut de la facture: ${response.status} ${response.statusText}`);
        // On continue malgré l'erreur car le paiement a déjà été supprimé
      } else {
        console.log(`Statut de la facture ID ${factureId} mis à jour avec succès`);
      }
    } catch (updateError) {
      console.error(`Erreur lors de la mise à jour du statut de la facture ID ${factureId}:`, updateError);
      // On continue malgré l'erreur car le paiement a déjà été supprimé
    }

    return NextResponse.json({ message: 'Paiement supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du paiement:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression du paiement' },
      { status: 500 }
    );
  }
} 