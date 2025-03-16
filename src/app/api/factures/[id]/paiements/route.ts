import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/factures/[id]/paiements - Récupérer les paiements d'une facture
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const factureId = parseInt(params.id);
    
    if (isNaN(factureId)) {
      return NextResponse.json(
        { message: 'ID de facture invalide' },
        { status: 400 }
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

    // Récupérer les paiements de la facture
    const paiements = await prisma.paiement.findMany({
      where: { factureId },
      include: {
        client: {
          select: {
            id: true,
            nom: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(paiements);
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des paiements' },
      { status: 500 }
    );
  }
} 