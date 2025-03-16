import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/factures - Récupérer toutes les factures
export async function GET() {
  try {
    const factures = await prisma.facture.findMany({
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

    return NextResponse.json(factures);
  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des factures' },
      { status: 500 }
    );
  }
}

// POST /api/factures - Créer une nouvelle facture
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validation des données
    const { clientId, date, echeance, lignes } = data;
    if (!clientId || !date || !echeance || !lignes || !Array.isArray(lignes) || lignes.length === 0) {
      return NextResponse.json(
        { message: 'Données invalides. ClientId, date, échéance et lignes sont requis' },
        { status: 400 }
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

    // Générer un numéro de facture unique
    const currentYear = new Date().getFullYear();
    const lastFacture = await prisma.facture.findFirst({
      where: {
        numero: {
          startsWith: `FACT-${currentYear}-`,
        },
      },
      orderBy: {
        numero: 'desc',
      },
    });

    let nextNumber = 1;
    if (lastFacture) {
      const lastNumber = parseInt(lastFacture.numero.split('-').pop() || '0');
      nextNumber = lastNumber + 1;
    }

    const numeroFacture = `FACT-${currentYear}-${nextNumber.toString().padStart(4, '0')}`;

    // Calculer les totaux
    let totalHT = 0;
    let totalTVA = 0;

    lignes.forEach((ligne: any) => {
      const ligneHT = ligne.quantite * ligne.prixUnitaire;
      const ligneTVA = ligneHT * (ligne.tva / 100);
      
      totalHT += ligneHT;
      totalTVA += ligneTVA;
    });

    const totalTTC = totalHT + totalTVA;

    // Créer la facture
    const nouvelleFacture = await prisma.facture.create({
      data: {
        numero: numeroFacture,
        clientId,
        date,
        echeance,
        statut: data.statut || 'En attente',
        lignes,
        totalHT,
        totalTVA,
        totalTTC,
        totalPaye: 0,
        resteAPayer: totalTTC,
        conditions: data.conditions,
        notes: data.notes,
        devisId: data.devisId,
      },
    });

    return NextResponse.json(nouvelleFacture);
  } catch (error) {
    console.error('Erreur lors de la création de la facture:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création de la facture' },
      { status: 500 }
    );
  }
} 