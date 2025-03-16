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
      { message: 'Erreur lors de la récupération des devis' },
      { status: 500 }
    );
  }
}

// POST /api/devis - Créer un nouveau devis
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validation des données
    const { clientId, date, validite, lignes } = data;
    if (!clientId || !date || !validite || !lignes || !Array.isArray(lignes) || lignes.length === 0) {
      return NextResponse.json(
        { message: 'Données invalides. ClientId, date, validité et lignes sont requis' },
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
    
    // Générer un numéro de devis unique
    const currentYear = new Date().getFullYear();
    const lastDevis = await prisma.devis.findFirst({
      where: {
        numero: {
          startsWith: `DEV-${currentYear}-`,
        },
      },
      orderBy: {
        numero: 'desc',
      },
    });
    
    let nextNumber = 1;
    if (lastDevis) {
      const lastNumber = parseInt(lastDevis.numero.split('-').pop() || '0');
      nextNumber = lastNumber + 1;
    }
    
    const numeroDevis = `DEV-${currentYear}-${nextNumber.toString().padStart(4, '0')}`;
    
    // Calculer les totaux
    let totalHT = 0;
    let totalTVA = 0;
    
    interface LigneDevis {
      quantite: number;
      prixUnitaire: number;
      tva: number;
    }

    lignes.forEach((ligne: LigneDevis) => {
      const ligneHT = ligne.quantite * ligne.prixUnitaire;
      const ligneTVA = ligneHT * (ligne.tva / 100);
      
      totalHT += ligneHT;
      totalTVA += ligneTVA;
    });
    
    const totalTTC = totalHT + totalTVA;
    
    // Créer le devis
    const nouveauDevis = await prisma.devis.create({
      data: {
        numero: numeroDevis,
        clientId,
        date,
        validite,
        statut: data.statut || 'Brouillon',
        lignes,
        totalHT,
        totalTVA,
        totalTTC,
        conditions: data.conditions,
        notes: data.notes,
      },
    });
    
    return NextResponse.json(nouveauDevis);
  } catch (error) {
    console.error('Erreur lors de la création du devis:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création du devis' },
      { status: 500 }
    );
  }
} 