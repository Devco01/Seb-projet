import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Configuration pour le mode standalone
export const dynamic = 'force-dynamic';


type RouteParams = {
  params: {
    id: string;
  };
};

// PUT /api/factures/[id]/payer - Marquer une facture comme payée
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

    // Calculer le total payé
    const totalPaye = facture.paiements.reduce((sum: number, paiement: { montant: number }) => sum + paiement.montant, 0);
    const resteAPayer = facture.totalTTC - totalPaye;

    // Déterminer le statut en fonction du montant payé
    let statut = 'En attente';
    if (totalPaye >= facture.totalTTC) {
      statut = 'Payée';
    } else if (totalPaye > 0) {
      statut = 'Partiellement payée';
    } else if (new Date(facture.echeance) < new Date()) {
      statut = 'En retard';
    }

    // Mettre à jour la facture
    const factureModifiee = await prisma.facture.update({
      where: { id },
      data: {
        statut,
      },
    });

    return NextResponse.json(factureModifiee);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de la facture:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du statut de la facture' },
      { status: 500 }
    );
  }
} 