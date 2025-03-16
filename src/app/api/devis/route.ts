import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/devis - Récupérer tous les devis
export async function GET() {
  try {
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
        date: 'desc',
      },
    });
    
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
    
    // Validation des données
    if (!data.clientId || !data.date || !data.validite || !data.lignes || data.lignes.length === 0) {
      return NextResponse.json(
        { error: 'Les champs clientId, date, validite et lignes sont obligatoires' },
        { status: 400 }
      );
    }
    
    // Vérifier si le client existe
    const client = await prisma.client.findUnique({
      where: { id: data.clientId },
    });
    
    if (!client) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }
    
    // Générer un numéro de devis unique
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Récupérer le dernier numéro de devis pour générer le suivant
    const lastDevis = await prisma.devis.findFirst({
      where: {
        numero: {
          startsWith: `D-${year}-`,
        },
      },
      orderBy: {
        numero: 'desc',
      },
    });
    
    let nextNumber = 1;
    if (lastDevis) {
      const lastNumber = parseInt(lastDevis.numero.split('-')[2]);
      nextNumber = lastNumber + 1;
    }
    
    const numero = `D-${year}-${String(nextNumber).padStart(3, '0')}`;
    
    // Calculer les totaux
    let totalHT = 0;
    let totalTVA = 0;
    
    for (const ligne of data.lignes) {
      const ligneHT = ligne.quantite * ligne.prixUnitaire;
      const ligneTVA = ligneHT * (ligne.tva / 100);
      
      totalHT += ligneHT;
      totalTVA += ligneTVA;
    }
    
    const totalTTC = totalHT + totalTVA;
    
    // Créer le devis
    const devis = await prisma.devis.create({
      data: {
        numero,
        clientId: data.clientId,
        date: new Date(data.date),
        validite: new Date(data.validite),
        statut: 'En attente',
        lignes: data.lignes,
        conditions: data.conditions,
        notes: data.notes,
        totalHT,
        totalTVA,
        totalTTC,
      },
    });
    
    return NextResponse.json(devis, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du devis:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du devis' },
      { status: 500 }
    );
  }
} 