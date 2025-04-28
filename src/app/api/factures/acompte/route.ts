import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { devisId, pourcentage = 30 } = await request.json();
    console.log(`Création facture d'acompte pour devis ${devisId} avec pourcentage ${pourcentage}%`);

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

    console.log(`Devis trouvé: ${devis.id} - ${devis.numero}`);

    // Calculer le montant de l'acompte
    const tauxAcompte = pourcentage / 100;
    const montantHT = devis.totalHT * tauxAcompte;
    const montantTTC = devis.totalTTC * tauxAcompte;

    // Générer un numéro de facture unique (format: FACT-ANNÉE-MOIS-NUMÉRO)
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    const lastFacture = await prisma.facture.findFirst({
      where: {
        numero: {
          startsWith: `A-${year}${month}`,
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

    const numeroFacture = `A-${year}${month}-${numeroSuffix.toString().padStart(3, '0')}`;

    console.log(`Numéro de facture généré: ${numeroFacture}`);

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

    console.log(`Facture d'acompte créée avec succès: ${facture.id} - ${facture.numero}`);
    
    // Retourner la réponse avec l'ID et les données d'impression
    return NextResponse.json({
      ...facture,
      success: true,
      message: "Facture d'acompte créée avec succès",
      printUrl: `/print?type=facture&id=${facture.id}`
    });
  } catch (error) {
    console.error('Erreur lors de la création de la facture d\'acompte:', error);
    // Renvoyer les détails de l'erreur pour faciliter le débogage
    return NextResponse.json(
      { 
        message: 'Erreur lors de la création de la facture d\'acompte',
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 