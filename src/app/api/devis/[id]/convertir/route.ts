import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/devis/[id]/convertir - Convertir un devis en facture
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de devis invalide' },
        { status: 400 }
      );
    }
    
    // Vérifier si le devis existe
    const devis = await prisma.devis.findUnique({
      where: { id },
      include: {
        client: true,
        factures: true,
      },
    });
    
    if (!devis) {
      return NextResponse.json(
        { error: 'Devis non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier si le devis a déjà été converti en facture
    if (devis.factures.length > 0) {
      return NextResponse.json(
        { error: 'Ce devis a déjà été converti en facture' },
        { status: 400 }
      );
    }
    
    // Vérifier si le devis est accepté
    if (devis.statut !== 'Accepté') {
      // Mettre à jour le statut du devis
      await prisma.devis.update({
        where: { id },
        data: {
          statut: 'Accepté',
        },
      });
    }
    
    // Générer un numéro de facture unique
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Récupérer le dernier numéro de facture pour générer le suivant
    const lastFacture = await prisma.facture.findFirst({
      where: {
        numero: {
          startsWith: `F-${year}-`,
        },
      },
      orderBy: {
        numero: 'desc',
      },
    });
    
    let nextNumber = 1;
    if (lastFacture) {
      const lastNumber = parseInt(lastFacture.numero.split('-')[2]);
      nextNumber = lastNumber + 1;
    }
    
    const numero = `F-${year}-${String(nextNumber).padStart(3, '0')}`;
    
    // Calculer la date d'échéance (30 jours après la date de facturation)
    const echeance = new Date();
    echeance.setDate(echeance.getDate() + 30);
    
    // Créer la facture
    const facture = await prisma.facture.create({
      data: {
        numero,
        clientId: devis.clientId,
        devisId: devis.id,
        date: new Date(),
        echeance,
        statut: 'En attente',
        lignes: devis.lignes,
        conditions: devis.conditions,
        notes: devis.notes,
        totalHT: devis.totalHT,
        totalTVA: devis.totalTVA,
        totalTTC: devis.totalTTC,
      },
    });
    
    return NextResponse.json(facture, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la conversion du devis en facture:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la conversion du devis en facture' },
      { status: 500 }
    );
  }
} 