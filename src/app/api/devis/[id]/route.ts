import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/devis/[id] - Récupérer un devis spécifique
export async function GET(
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
    
    const devis = await prisma.devis.findUnique({
      where: { id },
      include: {
        client: true,
        factures: {
          select: {
            id: true,
            numero: true,
            date: true,
            totalTTC: true,
            statut: true,
          },
        },
      },
    });
    
    if (!devis) {
      return NextResponse.json(
        { error: 'Devis non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(devis);
  } catch (error) {
    console.error('Erreur lors de la récupération du devis:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du devis' },
      { status: 500 }
    );
  }
}

// PUT /api/devis/[id] - Mettre à jour un devis
export async function PUT(
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
    
    const data = await request.json();
    
    // Validation des données
    if (!data.clientId || !data.date || !data.validite || !data.lignes || data.lignes.length === 0) {
      return NextResponse.json(
        { error: 'Les champs clientId, date, validite et lignes sont obligatoires' },
        { status: 400 }
      );
    }
    
    // Vérifier si le devis existe
    const existingDevis = await prisma.devis.findUnique({
      where: { id },
      include: {
        factures: true,
      },
    });
    
    if (!existingDevis) {
      return NextResponse.json(
        { error: 'Devis non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier si le devis a déjà été converti en facture
    if (existingDevis.factures.length > 0) {
      return NextResponse.json(
        { error: 'Impossible de modifier un devis qui a déjà été converti en facture' },
        { status: 400 }
      );
    }
    
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
    
    // Mettre à jour le devis
    const updatedDevis = await prisma.devis.update({
      where: { id },
      data: {
        clientId: data.clientId,
        date: new Date(data.date),
        validite: new Date(data.validite),
        statut: data.statut || existingDevis.statut,
        lignes: data.lignes,
        conditions: data.conditions,
        notes: data.notes,
        totalHT,
        totalTVA,
        totalTTC,
      },
    });
    
    return NextResponse.json(updatedDevis);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du devis:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du devis' },
      { status: 500 }
    );
  }
}

// DELETE /api/devis/[id] - Supprimer un devis
export async function DELETE(
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
    const existingDevis = await prisma.devis.findUnique({
      where: { id },
      include: {
        factures: true,
      },
    });
    
    if (!existingDevis) {
      return NextResponse.json(
        { error: 'Devis non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier si le devis a déjà été converti en facture
    if (existingDevis.factures.length > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer un devis qui a déjà été converti en facture' },
        { status: 400 }
      );
    }
    
    // Supprimer le devis
    await prisma.devis.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du devis:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du devis' },
      { status: 500 }
    );
  }
} 