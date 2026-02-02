import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/devis/[id] - Récupérer un devis spécifique
export async function GET(request: NextRequest, props: RouteParams) {
  const params = await props.params;
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
export async function PUT(request: NextRequest, props: RouteParams) {
  const params = await props.params;
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
    
    // Calculer les totaux sans TVA
    let totalHT = 0;
    
    for (const ligne of data.lignes) {
      const ligneHT = ligne.quantite * ligne.prixUnitaire;      
      totalHT += ligneHT;
    }
    
    // Sans TVA, totalTTC est identique à totalHT
    const totalTTC = totalHT;
    
    console.log(`Mise à jour du devis ${id}:`, {
      totalHT,
      totalTTC
    });
    
    // Mettre à jour le devis
    const updatedDevis = await prisma.devis.update({
      where: { id },
      data: {
        clientId: data.clientId,
        date: new Date(data.date),
        validite: new Date(data.validite),
        statut: data.statut || existingDevis.statut,
        lignes: JSON.stringify(data.lignes),
        conditions: data.conditions,
        notes: data.notes,
        totalHT,
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
export async function DELETE(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  try {
    const id = parseInt(params.id);
    console.log(`Tentative de suppression du devis avec ID: ${id}`);
    
    if (isNaN(id)) {
      console.error(`ID de devis invalide: ${params.id}`);
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
      console.error(`Devis non trouvé avec ID: ${id}`);
      return NextResponse.json(
        { error: 'Devis non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier si le devis a déjà été converti en facture
    if (existingDevis.factures.length > 0) {
      console.error(`Impossible de supprimer le devis ID ${id} car il a été converti en facture. Nombre de factures: ${existingDevis.factures.length}`);
      
      return NextResponse.json(
        { 
          error: 'Impossible de supprimer un devis qui a déjà été converti en facture',
          details: {
            nbFactures: existingDevis.factures.length,
            factureIds: existingDevis.factures.map(f => f.id)
          }
        },
        { status: 400 }
      );
    }
    
    // Supprimer le devis
    await prisma.devis.delete({
      where: { id },
    });
    
    console.log(`Devis ID ${id} supprimé avec succès`);
    return NextResponse.json({ 
      success: true,
      message: 'Devis supprimé avec succès'
    });
  } catch (error) {
    console.error(`Erreur lors de la suppression du devis ID ${params.id}:`, error);
    
    // Afficher plus de détails sur l'erreur
    if (error.code) {
      console.error(`Code d'erreur: ${error.code}`);
    }
    
    if (error.meta) {
      console.error('Métadonnées d\'erreur:', error.meta);
    }
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la suppression du devis',
        details: error.message
      },
      { status: 500 }
    );
  }
} 