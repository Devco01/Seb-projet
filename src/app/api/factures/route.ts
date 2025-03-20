import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/factures - Récupérer toutes les factures
export async function GET() {
  try {
    console.log('Tentative de récupération des factures...');
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
        createdAt: 'desc',
      },
    });

    // Avec PostgreSQL, les lignes sont déjà en format JSON
    console.log(`${factures.length} factures récupérées`);
    return NextResponse.json(factures);
  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des factures' },
      { status: 500 }
    );
  }
}

// POST /api/factures - Créer une nouvelle facture
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Données reçues pour la création de la facture:', data);

    // Validation des données
    if (!data.clientId || !data.date || !data.echeance || !data.lignes) {
      return NextResponse.json(
        { error: 'Les champs clientId, date, echeance et lignes sont obligatoires' },
        { status: 400 }
      );
    }

    // Vérifier que le client existe
    const client = await prisma.client.findUnique({
      where: { id: data.clientId },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }

    // Générer un numéro de facture unique (format: FACT-ANNÉE-NUMÉRO)
    const year = new Date().getFullYear();
    const lastFacture = await prisma.facture.findFirst({
      where: {
        numero: {
          startsWith: `FACT-${year}`,
        },
      },
      orderBy: {
        numero: 'desc',
      },
    });

    let numeroSuffix = 1;
    if (lastFacture && lastFacture.numero) {
      const parts = lastFacture.numero.split('-');
      if (parts.length === 3) {
        numeroSuffix = parseInt(parts[2], 10) + 1;
      }
    }

    const numero = `FACT-${year}-${numeroSuffix.toString().padStart(3, '0')}`;

    // Calculer les totaux sans TVA
    let totalHT = 0;
    let totalTTC = 0;

    if (Array.isArray(data.lignes)) {
      for (const ligne of data.lignes) {
        const montantHT = parseFloat(ligne.quantite) * parseFloat(ligne.prixUnitaire);
        totalHT += montantHT;
      }
      
      // Sans TVA, le total TTC est identique au total HT
      totalTTC = totalHT;
    }

    // Avec PostgreSQL, pas besoin de convertir en string
    // Créer la facture
    const facture = await prisma.facture.create({
      data: {
        numero,
        clientId: data.clientId,
        date: new Date(data.date),
        echeance: new Date(data.echeance),
        statut: data.statut || 'en attente',
        lignes: data.lignes, // Directement en JSON pour PostgreSQL
        totalHT,
        totalTTC,
        conditions: data.conditions,
        notes: data.notes,
        devisId: data.devisId,
      },
      include: {
        client: {
          select: {
            id: true,
            nom: true,
            email: true,
          },
        },
      },
    });

    console.log('Facture créée avec succès:', facture);
    
    return NextResponse.json(facture, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la facture:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la facture' },
      { status: 500 }
    );
  }
} 