import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/devis - Récupérer tous les devis
export async function GET() {
  try {
    console.log('Tentative de récupération des devis...');
    const devis = await prisma.devis.findMany({
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
    console.log(`${devis.length} devis récupérés`);
    return NextResponse.json(devis);
  } catch (error) {
    console.error('Erreur lors de la récupération des devis:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des devis' },
      { status: 500 }
    );
  }
}

// POST /api/devis - Créer un nouveau devis
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Données reçues pour la création du devis:', data);

    // Validation des données
    if (!data.clientId || !data.date || !data.validite || !data.lignes) {
      return NextResponse.json(
        { error: 'Les champs clientId, date, validite et lignes sont obligatoires' },
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

    // Générer un numéro de devis unique (format: DEV-ANNÉE-NUMÉRO)
    const year = new Date().getFullYear();
    const lastDevis = await prisma.devis.findFirst({
      where: {
        numero: {
          startsWith: `DEV-${year}`,
        },
      },
      orderBy: {
        numero: 'desc',
      },
    });

    let numeroSuffix = 1;
    if (lastDevis && lastDevis.numero) {
      const parts = lastDevis.numero.split('-');
      if (parts.length === 3) {
        numeroSuffix = parseInt(parts[2], 10) + 1;
      }
    }

    const numero = `DEV-${year}-${numeroSuffix.toString().padStart(3, '0')}`;

    // Calculer les totaux
    let totalHT = 0;
    let totalTVA = 0;
    let totalTTC = 0;

    if (Array.isArray(data.lignes)) {
      for (const ligne of data.lignes) {
        const montantHT = parseFloat(ligne.quantite) * parseFloat(ligne.prixUnitaire);
        const montantTVA = montantHT * (parseFloat(ligne.tauxTVA) / 100);
        
        totalHT += montantHT;
        totalTVA += montantTVA;
      }
      
      totalTTC = totalHT + totalTVA;
    }

    // Avec PostgreSQL, pas besoin de convertir en string
    // Créer le devis
    const devis = await prisma.devis.create({
      data: {
        numero,
        clientId: data.clientId,
        date: new Date(data.date),
        validite: new Date(data.validite),
        statut: data.statut || 'brouillon',
        lignes: data.lignes, // Directement en JSON pour PostgreSQL
        totalHT,
        totalTTC,
        conditions: data.conditions,
        notes: data.notes,
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

    console.log('Devis créé avec succès:', devis);
    
    return NextResponse.json(devis, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du devis:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du devis' },
      { status: 500 }
    );
  }
} 