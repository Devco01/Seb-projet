import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Récupérer les données avec validation
    let requestData;
    try {
      requestData = await request.json();
      console.log('Données reçues:', JSON.stringify(requestData));
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      return NextResponse.json(
        { message: 'Format de requête invalide', details: 'Impossible de parser le JSON' },
        { status: 400 }
      );
    }

    const { devisId, pourcentage, montant } = requestData;
    console.log(`Création facture d'acompte pour devis ${devisId}`, pourcentage ? `avec pourcentage ${pourcentage}%` : `avec montant ${montant}€`);

    // Validation des paramètres
    if (!devisId) {
      console.error('ID du devis manquant dans la requête');
      return NextResponse.json(
        { message: 'ID du devis manquant' },
        { status: 400 }
      );
    }

    // Conversion explicite en nombre pour éviter les erreurs
    const devisIdNumber = parseInt(devisId, 10);
    
    if (isNaN(devisIdNumber)) {
      console.error(`ID du devis invalide: ${devisId} (n'est pas un nombre)`);
      return NextResponse.json(
        { message: 'ID du devis invalide, doit être un nombre' },
        { status: 400 }
      );
    }

    // Récupérer le devis avec gestion d'erreur
    let devis;
    try {
      devis = await prisma.devis.findUnique({
        where: { id: devisIdNumber },
        include: { client: true },
      });
    } catch (dbError) {
      console.error('Erreur lors de la récupération du devis:', dbError);
      return NextResponse.json(
        { message: 'Erreur lors de la récupération du devis', details: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }

    if (!devis) {
      console.error(`Devis non trouvé pour l'ID: ${devisIdNumber}`);
      return NextResponse.json(
        { message: 'Devis non trouvé' },
        { status: 404 }
      );
    }

    console.log(`Devis trouvé: ${devis.id} - ${devis.numero}`);
    
    // Vérification des données du devis
    if (!devis.totalHT || !devis.totalTTC) {
      console.error(`Devis avec montants invalides: totalHT=${devis.totalHT}, totalTTC=${devis.totalTTC}`);
      return NextResponse.json(
        { message: 'Le devis a des montants invalides' },
        { status: 400 }
      );
    }

    // Vérifier les acomptes existants
    const acomptesExistants = await prisma.facture.findMany({
      where: {
        devisId: devisIdNumber,
        notes: {
          contains: 'FACTURE D\'ACOMPTE'
        }
      }
    });

    // Vérifier le nombre maximum d'acomptes (4)
    if (acomptesExistants.length >= 4) {
      return NextResponse.json(
        { message: 'Nombre maximum d\'acomptes atteint (4)' },
        { status: 400 }
      );
    }

    // Calculer le total des pourcentages existants
    let totalPourcentageExistant = 0;
    for (const acompte of acomptesExistants) {
      const pourcentageMatch = acompte.notes?.match(/représentant (\d+)%/);
      if (pourcentageMatch) {
        totalPourcentageExistant += parseInt(pourcentageMatch[1], 10);
      }
    }

    // Calculer le montant de l'acompte selon les paramètres reçus
    let montantHT: number;
    let montantTTC: number;
    let pourcentageCalcule: number;

    if (montant) {
      // Si un montant est fourni, l'utiliser directement
      montantTTC = montant;
      montantHT = montant; // Pour simplifier, on garde le même montant HT et TTC
      pourcentageCalcule = (montant / devis.totalTTC) * 100;
      
      // Vérifier que le montant ne dépasse pas le restant du devis
      const totalMontantExistant = acomptesExistants.reduce((sum, acompte) => sum + acompte.totalTTC, 0);
      const montantRestant = devis.totalTTC - totalMontantExistant;
      
      if (montant > montantRestant) {
        return NextResponse.json(
          { message: `Montant trop élevé. Maximum autorisé: ${montantRestant.toFixed(2)}€` },
          { status: 400 }
        );
      }
    } else {
      // Si un pourcentage est fourni (rétrocompatibilité)
      const pourcentageUtilise = pourcentage || 30;
      
      // Vérifier que le nouveau pourcentage ne dépasse pas 100%
      if (totalPourcentageExistant + pourcentageUtilise > 100) {
        return NextResponse.json(
          { message: `Pourcentage trop élevé. Maximum autorisé: ${100 - totalPourcentageExistant}%` },
          { status: 400 }
        );
      }
      
      const tauxAcompte = pourcentageUtilise / 100;
      montantHT = devis.totalHT * tauxAcompte;
      montantTTC = devis.totalTTC * tauxAcompte;
      pourcentageCalcule = pourcentageUtilise;
    }

    // Générer un numéro de facture unique pour l'acompte
    // Format: A{numéro_acompte}-DEVIS_NUMERO-ANNÉE-MOIS-NUMÉRO
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const numeroAcompte = acomptesExistants.length + 1;
    
    // Récupération du dernier numéro avec gestion d'erreur
    let lastFacture;
    try {
      lastFacture = await prisma.facture.findFirst({
        where: {
          numero: {
            startsWith: `A${numeroAcompte}-${devis.numero}`,
          }
        },
        orderBy: {
          numero: 'desc',
        },
      });
    } catch (dbError) {
      console.error('Erreur lors de la récupération de la dernière facture:', dbError);
      return NextResponse.json(
        { message: 'Erreur lors de la génération du numéro de facture', details: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }

    let numeroSuffix = 1;
    if (lastFacture && lastFacture.numero) {
      const parts = lastFacture.numero.split('-');
      if (parts.length >= 4) {
        numeroSuffix = parseInt(parts[parts.length - 1], 10) + 1;
      }
    }

    const numeroFacture = `A${numeroAcompte}-${devis.numero}-${year}${month}-${numeroSuffix.toString().padStart(3, '0')}`;
    console.log(`Numéro de facture généré: ${numeroFacture}`);

    // Calculer le montant restant après cet acompte
    const totalMontantExistant = acomptesExistants.reduce((sum, acompte) => sum + acompte.totalTTC, 0);
    const montantRestantApresAcompte = devis.totalTTC - totalMontantExistant - montantTTC;

    // Créer une ligne unique pour l'acompte
    const ligneAcompte = {
      description: `Acompte ${pourcentageCalcule.toFixed(1)}% sur devis n°${devis.numero}`,
      quantite: 1,
      unite: 'forfait',
      prixUnitaire: montantHT,
      total: montantHT
    };

    // Créer la facture d'acompte avec gestion d'erreur
    let facture;
    try {
      // Vérifier les champs disponibles dans le modèle Facture
      const prismaSchema = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'Facture'`;
      console.log('Colonnes disponibles dans la table Facture:', prismaSchema);
      
      // Créer un objet de données avec uniquement les champs garantis existants
      const factureData = {
        numero: numeroFacture,
        date: new Date(),
        echeance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours par défaut
        statut: 'En attente',
        clientId: devis.clientId,
        devisId: devis.id,
        lignes: JSON.stringify([ligneAcompte]),
        conditions: `Acompte de ${pourcentageCalcule.toFixed(1)}% sur le devis n°${devis.numero}. ${devis.conditions || ''}`,
        notes: `FACTURE D'ACOMPTE: Ceci est une facture d'acompte représentant ${pourcentageCalcule.toFixed(1)}% du montant total du devis n°${devis.numero}.

RÉCAPITULATIF DES MONTANTS:
- Montant total du devis: ${devis.totalTTC.toFixed(2)} €
- Montant de cet acompte: ${montantTTC.toFixed(2)} €
- Montant restant à payer: ${montantRestantApresAcompte.toFixed(2)} €`,
        totalHT: montantHT,
        totalTTC: montantTTC
      };
      
      facture = await prisma.facture.create({
        data: factureData
      });
    } catch (dbError) {
      console.error('Erreur lors de la création de la facture:', dbError);
      return NextResponse.json(
        { message: 'Erreur lors de la création de la facture', details: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }

    console.log(`Facture d'acompte créée avec succès: ${facture.id} - ${facture.numero}`);
    
    // Retourner la réponse avec l'ID et les données d'impression
    return NextResponse.json({
      id: facture.id,
      numero: facture.numero,
      success: true,
      message: "Facture d'acompte créée avec succès",
      printUrl: `/print?type=facture&id=${facture.id}`
    });
  } catch (error) {
    console.error('Erreur inattendue lors de la création de la facture d\'acompte:', error);
    // Renvoyer les détails de l'erreur pour faciliter le débogage
    return NextResponse.json(
      { 
        message: 'Erreur lors de la création de la facture d\'acompte',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 