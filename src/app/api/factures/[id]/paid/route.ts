import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/factures/[id]/paid - Marquer une facture comme payée
export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    // Convertir l'ID en nombre
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de facture invalide' },
        { status: 400 }
      );
    }
    
    console.log(`Tentative de marquer la facture ${id} comme payée...`);

    // Vérifier que la facture existe
    const facture = await prisma.facture.findUnique({
      where: { id },
    });

    if (!facture) {
      return NextResponse.json(
        { error: 'Facture non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour le statut de la facture
    const factureUpdated = await prisma.facture.update({
      where: { id },
      data: {
        statut: 'payée',
      },
    });

    console.log('Facture mise à jour avec succès:', factureUpdated);
    return NextResponse.json(factureUpdated);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la facture:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la facture' },
      { status: 500 }
    );
  }
} 