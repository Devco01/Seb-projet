import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const devisId = parseInt(params.id, 10);
    
    if (isNaN(devisId)) {
      return NextResponse.json(
        { message: 'ID de devis invalide' },
        { status: 400 }
      );
    }

    console.log("Conversion du devis ID:", devisId);
    
    // Récupérer le devis avec ses informations
    const devis = await prisma.devis.findUnique({
      where: { id: devisId },
      include: {
        client: true,
        factures: true
      }
    });

    if (!devis) {
      return NextResponse.json(
        { message: 'Devis non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si le devis n'a pas déjà été converti
    const factureExistante = devis.factures.find(f => !f.notes?.includes('FACTURE D\'ACOMPTE'));
    if (factureExistante) {
      return NextResponse.json(
        { message: 'Ce devis a déjà été converti en facture', factureId: factureExistante.id },
        { status: 400 }
      );
    }

    // Générer un numéro de facture unique (format: FACT-ANNÉE-NUMÉRO)
    const year = new Date().getFullYear();
    const lastFacture = await prisma.facture.findFirst({
      where: {
        numero: {
          startsWith: `FACT-${year}`,
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

    const numeroFacture = `FACT-${year}-${numeroSuffix.toString().padStart(3, '0')}`;

    // Traiter les lignes du devis
    let lignes = [];
    if (devis.lignes) {
      if (typeof devis.lignes === 'string') {
        try {
          lignes = JSON.parse(devis.lignes);
        } catch (e) {
          console.error('Erreur parsing lignes:', e);
          lignes = [];
        }
      } else if (Array.isArray(devis.lignes)) {
        lignes = devis.lignes;
      }
    }

    // Vérifier s'il y a des acomptes existants pour ce devis
    const acomptes = await prisma.facture.findMany({
      where: {
        devisId: devisId,
        notes: {
          contains: 'FACTURE D\'ACOMPTE'
        }
      }
    });

    let lignesFacture = [...lignes];
    let notes = `Facture basée sur le devis n°${devis.numero}`;
    let totalHT = devis.totalHT;
    let totalTTC = devis.totalTTC;

    // Si des acomptes existent, les déduire de la facture finale
    if (acomptes.length > 0) {
      const totalAcomptesHT = acomptes.reduce((sum, acompte) => sum + acompte.totalHT, 0);
      const totalAcomptesTTC = acomptes.reduce((sum, acompte) => sum + acompte.totalTTC, 0);
      
      // Ajouter des lignes de déduction pour chaque acompte
      for (const acompte of acomptes) {
        lignesFacture.push({
          description: `Déduction acompte facture n°${acompte.numero}`,
          quantite: 1,
          prixUnitaire: -acompte.totalHT,
          total: -acompte.totalHT
        });
      }
      
      // Ajuster les totaux
      totalHT = Math.max(0, devis.totalHT - totalAcomptesHT);
      totalTTC = Math.max(0, devis.totalTTC - totalAcomptesTTC);
      
      notes += `\n\nCette facture prend en compte les acomptes déjà versés d'un montant total de ${totalAcomptesTTC.toFixed(2)} €.`;
    }

    // Créer la facture
    const facture = await prisma.facture.create({
      data: {
        numero: numeroFacture,
        clientId: devis.clientId,
        date: new Date(),
        echeance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours par défaut
        statut: 'En attente',
        devisId: devis.id,
        lignes: JSON.stringify(lignesFacture),
        totalHT,
        totalTTC,
        conditions: devis.conditions || 'Paiement à 30 jours à compter de la date de facturation.',
        notes
      }
    });

    console.log(`Facture créée avec succès: ${facture.id} - ${facture.numero}`);
    
    return NextResponse.json({
      success: true,
      message: "Devis converti en facture avec succès",
      factureId: facture.id,
      numero: facture.numero
    });
  } catch (error) {
    console.error('Erreur lors de la conversion du devis:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la conversion du devis', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 