import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/factures/[id]/payer - Marquer une facture comme payée
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Mise à jour du statut de paiement pour la facture ID: ${params.id}`);
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      console.error(`ID de facture invalide: ${params.id}`);
      return NextResponse.json(
        { message: 'ID de facture invalide' },
        { status: 400 }
      );
    }

    // Vérifier si la facture existe
    let facture;
    try {
      facture = await prisma.facture.findUnique({
        where: { id },
        include: {
          paiements: true,
        },
      });
    } catch (findError) {
      console.error(`Erreur lors de la recherche de la facture ID ${id}:`, findError);
      throw findError;
    }

    if (!facture) {
      console.error(`Facture non trouvée avec ID: ${id}`);
      return NextResponse.json(
        { message: 'Facture non trouvée' },
        { status: 404 }
      );
    }

    console.log(`Facture trouvée ID ${id}:`, {
      id: facture.id,
      numero: facture.numero,
      totalTTC: facture.totalTTC,
      echeance: facture.echeance,
      statut: facture.statut,
      nbPaiements: facture.paiements?.length || 0
    });

    // Calculer le total payé
    const totalPaye = facture.paiements ? facture.paiements.reduce(
      (sum: number, paiement: { montant: number }) => sum + paiement.montant, 0
    ) : 0;
    
    console.log(`Facture ID ${id}: Total TTC = ${facture.totalTTC}, Total payé = ${totalPaye}`);
    
    // Déterminer le statut en fonction du montant payé
    let statut = 'En attente';
    if (totalPaye >= facture.totalTTC) {
      statut = 'Payée';
    } else if (totalPaye > 0) {
      statut = 'Partiellement payée';
    } else if (new Date(facture.echeance) < new Date()) {
      statut = 'En retard';
    }
    
    console.log(`Mise à jour du statut de la facture ID ${id} vers: ${statut}`);

    // Mettre à jour uniquement le statut de la facture
    let factureModifiee;
    try {
      factureModifiee = await prisma.facture.update({
        where: { id },
        data: {
          statut,
        },
      });
      console.log(`Facture ID ${id} mise à jour avec succès, nouveau statut: ${factureModifiee.statut}`);
    } catch (updateError) {
      console.error(`Erreur lors de la mise à jour de la facture ID ${id}:`, updateError);
      throw updateError;
    }

    return NextResponse.json(factureModifiee);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de la facture:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du statut de la facture', error: String(error) },
      { status: 500 }
    );
  }
} 