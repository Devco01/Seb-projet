import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const devisId = parseInt(params.id, 10);
    
    if (isNaN(devisId)) {
      return NextResponse.json(
        { error: 'ID de devis invalide' },
        { status: 400 }
      );
    }

    // Récupérer les factures d'acompte liées à ce devis
    const acomptes = await prisma.facture.findMany({
      where: {
        devisId: devisId,
        notes: {
          contains: 'FACTURE D\'ACOMPTE'
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Formater les données pour l'interface
    const acomptesFormatted = acomptes.map(acompte => {
      // Extraire le pourcentage depuis les notes
      const pourcentageMatch = acompte.notes?.match(/représentant (\d+)%/);
      const pourcentage = pourcentageMatch ? parseInt(pourcentageMatch[1], 10) : 0;

      return {
        id: acompte.id,
        numero: acompte.numero,
        pourcentage: pourcentage,
        montant: acompte.totalTTC,
        statut: acompte.statut,
        date: acompte.date.toISOString().split('T')[0]
      };
    });

    return NextResponse.json(acomptesFormatted);
  } catch (error) {
    console.error('Erreur lors de la récupération des acomptes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des acomptes' },
      { status: 500 }
    );
  }
} 