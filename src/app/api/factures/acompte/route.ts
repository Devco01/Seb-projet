import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateNumeroFacture } from '@/utils/numeroGenerator';

export async function POST(request: NextRequest) {
  try {
    const { devisId, pourcentage = 30 } = await request.json();

    if (!devisId) {
      return NextResponse.json(
        { message: 'ID du devis manquant' },
        { status: 400 }
      );
    }

    // Récupérer le devis
    const devis = await prisma.devis.findUnique({
      where: { id: parseInt(devisId) },
      include: { client: true },
    });

    if (!devis) {
      return NextResponse.json(
        { message: 'Devis non trouvé' },
        { status: 404 }
      );
    }

    // Générer le numéro de facture
    const numeroFacture = await generateNumeroFacture();

    // Calculer le montant de l'acompte
    const tauxAcompte = pourcentage / 100;
    const montantHT = devis.totalHT * tauxAcompte;
    const montantTTC = devis.totalTTC * tauxAcompte;

    // Créer une ligne unique pour l'acompte
    const ligneAcompte = {
      description: `Acompte ${pourcentage}% sur devis n°${devis.numero}`,
      quantite: 1,
      unite: 'forfait',
      prixUnitaire: montantHT,
      total: montantHT
    };

    // Créer la facture d'acompte
    const facture = await prisma.facture.create({
      data: {
        numero: numeroFacture,
        date: new Date(),
        echeance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours par défaut
        statut: 'En attente',
        clientId: devis.clientId,
        devisId: devis.id,
        lignes: JSON.stringify([ligneAcompte]),
        conditions: `Acompte de ${pourcentage}% sur le devis n°${devis.numero}. ${devis.conditions || ''}`,
        notes: `FACTURE D'ACOMPTE: Ceci est une facture d'acompte représentant ${pourcentage}% du montant total du devis n°${devis.numero}.`,
        totalHT: montantHT,
        totalTTC: montantTTC
      },
    });

    return NextResponse.json(facture);
  } catch (error) {
    console.error('Erreur lors de la création de la facture d\'acompte:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création de la facture d\'acompte' },
      { status: 500 }
    );
  }
} 