import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Configuration pour le mode standalone
export const dynamic = 'force-dynamic';


type RouteParams = {
  params: {
    id: string;
  };
};

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

    // Calculer les totaux
    let totalHT = 0;
    let totalTVA = 0;

    interface LigneFacture {
      quantite: number;
      prixUnitaire: number;
      tva: number;
    }

    lignes.forEach((ligne: LigneFacture) => {
      const ligneHT = ligne.quantite * ligne.prixUnitaire;
      const ligneTVA = ligneHT * (ligne.tva / 100);
      
      totalHT += ligneHT;
      totalTVA += ligneTVA;
    });

    const totalTTC = totalHT + totalTVA;

    // Mettre à jour la facture
    const factureModifiee = await prisma.facture.update({
      where: { id },
      data: {
        clientId,
        date,
        echeance,
        statut: data.statut || facture.statut,
        lignes: JSON.stringify(lignes),
        totalHT,
        totalTVA,
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
    
    if (isNaN(id)) {
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
      return NextResponse.json(
        { message: 'Facture non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si la facture a des paiements
    if (facture.paiements.length > 0) {
      return NextResponse.json(
        { message: 'Impossible de supprimer une facture avec des paiements' },
        { status: 400 }
      );
    }

    // Supprimer la facture
    await prisma.facture.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Facture supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la facture:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression de la facture' },
      { status: 500 }
    );
  }
} 