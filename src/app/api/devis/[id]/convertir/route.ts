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
        { message: 'ID de devis invalide' },
        { status: 400 }
      );
    }
    
    // Vérifier si le devis existe
    const devis = await prisma.devis.findUnique({
      where: { id },
      include: {
        factures: true,
      },
    });
    
    if (!devis) {
      return NextResponse.json(
        { message: 'Devis non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier si le devis a déjà été converti en facture
    if (devis.factures.length > 0) {
      return NextResponse.json(
        { message: 'Ce devis a déjà été converti en facture' },
        { status: 400 }
      );
    }
    
    // Mettre à jour le statut du devis si nécessaire
    if (devis.statut !== 'Accepté') {
      await prisma.devis.update({
        where: { id },
        data: {
          statut: 'Accepté',
        },
      });
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
    
    // Calculer la date d'échéance (30 jours après la date actuelle)
    const dateEcheance = new Date();
    dateEcheance.setDate(dateEcheance.getDate() + 30);
    
    // Créer la facture
    const nouvelleFacture = await prisma.facture.create({
      data: {
        numero: numeroFacture,
        clientId: devis.clientId,
        date: new Date().toISOString().split('T')[0],
        echeance: dateEcheance.toISOString().split('T')[0],
        statut: 'En attente',
        lignes: devis.lignes,
        totalHT: devis.totalHT,
        totalTVA: devis.totalTVA,
        totalTTC: devis.totalTTC,
        totalPaye: 0,
        resteAPayer: devis.totalTTC,
        conditions: devis.conditions,
        notes: devis.notes,
        devisId: devis.id,
      },
    });
    
    // Mettre à jour le devis avec l'ID de la facture
    await prisma.devis.update({
      where: { id },
      data: {
        factureId: nouvelleFacture.id,
      },
    });
    
    return NextResponse.json(nouvelleFacture);
  } catch (error) {
    console.error('Erreur lors de la conversion du devis en facture:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la conversion du devis en facture' },
      { status: 500 }
    );
  }
} 