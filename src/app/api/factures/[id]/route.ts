import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/factures/[id] - Récupérer une facture par son ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'ID de facture invalide' },
        { status: 400 }
      );
    }

    const facture = await prisma.facture.findUnique({
      where: { id },
      include: {
        client: true,
        paiements: {
          orderBy: {
            date: 'desc',
          },
        },
        devis: {
          select: {
            id: true,
            numero: true,
          },
        },
      },
    });

    if (!facture) {
      return NextResponse.json(
        { message: 'Facture non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(facture);
  } catch (error) {
    console.error('Erreur lors de la récupération de la facture:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération de la facture' },
      { status: 500 }
    );
  }
}

// PUT /api/factures/[id] - Mettre à jour une facture
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'ID de facture invalide' },
        { status: 400 }
      );
    }

    const data = await request.json();

    // Validation des données
    const { clientId, date, echeance, lignes } = data;
    if (!clientId || !date || !echeance || !lignes || !Array.isArray(lignes) || lignes.length === 0) {
      return NextResponse.json(
        { message: 'Données invalides. ClientId, date, échéance et lignes sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si la facture existe
    const facture = await prisma.facture.findUnique({
      where: { id },
      include: {
        paiements: true,
      },
    });

    if (!facture) {
      return NextResponse.json(
        { message: 'Facture non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si la facture a des paiements
    if (facture.paiements.length > 0 && facture.statut !== 'En attente') {
      return NextResponse.json(
        { message: 'Impossible de modifier une facture avec des paiements' },
        { status: 400 }
      );
    }

    // Calculer les totaux sans TVA
    let totalHT = 0;

    interface LigneFacture {
      quantite: number;
      prixUnitaire: number;
    }

    lignes.forEach((ligne: LigneFacture) => {
      const ligneHT = ligne.quantite * ligne.prixUnitaire;      
      totalHT += ligneHT;
    });

    // Sans TVA, le total TTC est identique au total HT
    const totalTTC = totalHT;
    
    // Calculer le montant restant à payer en tenant compte des paiements existants
    const totalPaiements = facture.paiements.reduce((sum, p) => sum + p.montant, 0);
    const resteAPayer = totalTTC - totalPaiements;

    console.log(`Mise à jour de la facture ${id}:`, {
      totalHT,
      totalTTC,
      totalPaiements,
      resteAPayer
    });

    // Mettre à jour la facture
    const factureModifiee = await prisma.facture.update({
      where: { id },
      data: {
        clientId,
        date: new Date(date),
        echeance: new Date(echeance),
        statut: data.statut || facture.statut,
        lignes: JSON.stringify(lignes), // Convertir en string JSON pour le stockage
        totalHT,
        totalTTC,
        conditions: data.conditions,
        notes: data.notes,
      },
    });

    return NextResponse.json(factureModifiee);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la facture:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de la facture' },
      { status: 500 }
    );
  }
}

// DELETE /api/factures/[id] - Supprimer une facture
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    console.log(`Tentative de suppression de la facture avec ID: ${id}`);
    
    if (isNaN(id)) {
      console.error(`ID de facture invalide: ${params.id}`);
      return NextResponse.json(
        { message: 'ID de facture invalide' },
        { status: 400 }
      );
    }

    // Vérifier si la facture existe
    const facture = await prisma.facture.findUnique({
      where: { id },
      include: {
        paiements: true,
      },
    });

    if (!facture) {
      console.error(`Facture non trouvée avec ID: ${id}`);
      return NextResponse.json(
        { message: 'Facture non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si la facture a des paiements
    if (facture.paiements.length > 0) {
      console.error(`Impossible de supprimer la facture ID ${id} car elle a des paiements. Nombre de paiements: ${facture.paiements.length}`);
      
      return NextResponse.json(
        { 
          message: 'Impossible de supprimer une facture avec des paiements',
          details: {
            nbPaiements: facture.paiements.length,
            paiementIds: facture.paiements.map(p => p.id),
            totalPaiements: facture.paiements.reduce((sum, p) => sum + p.montant, 0)
          }
        },
        { status: 400 }
      );
    }

    // Supprimer la facture
    await prisma.facture.delete({
      where: { id },
    });

    console.log(`Facture ID ${id} supprimée avec succès`);
    return NextResponse.json({ 
      message: 'Facture supprimée avec succès',
      success: true
    });
  } catch (error) {
    console.error(`Erreur lors de la suppression de la facture ID ${params.id}:`, error);
    
    // Afficher plus de détails sur l'erreur
    if (error.code) {
      console.error(`Code d'erreur: ${error.code}`);
    }
    
    if (error.meta) {
      console.error('Métadonnées d\'erreur:', error.meta);
    }
    
    return NextResponse.json(
      { 
        message: 'Erreur lors de la suppression de la facture',
        details: error.message
      },
      { status: 500 }
    );
  }
} 