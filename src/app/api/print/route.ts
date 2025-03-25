import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/print - Récupérer les données d'impression
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || '';
    const id = searchParams.get('id') || '';

    if (!id || !['devis', 'facture', 'paiement'].includes(type)) {
      return NextResponse.json(
        { message: 'Type ou ID manquant ou invalide' },
        { status: 400 }
      );
    }

    let data = null;
    let formattedData = null;

    // Récupérer les données selon le type
    if (type === 'devis') {
      data = await prisma.devis.findUnique({
        where: { id: parseInt(id) },
        include: {
          client: true,
        },
      });

      if (!data) {
        return NextResponse.json(
          { message: 'Devis non trouvé' },
          { status: 404 }
        );
      }

      // Traiter les lignes si elles sont en format JSON string
      let lignes = [];
      if (data.lignes) {
        if (typeof data.lignes === 'string') {
          try {
            lignes = JSON.parse(data.lignes);
          } catch (e) {
            console.error('Erreur parsing lignes:', e);
            lignes = [];
          }
        } else if (Array.isArray(data.lignes)) {
          lignes = data.lignes;
        }
      }

      formattedData = {
        type: 'devis',
        reference: data.numero || `#${data.id}`,
        date: data.date ? data.date.toISOString() : new Date().toISOString(),
        echeance: data.validite ? data.validite.toISOString() : undefined,
        clientName: data.client?.nom || 'Client',
        clientAddress: data.client?.adresse || '',
        clientZipCity: `${data.client?.codePostal || ''} ${data.client?.ville || ''}`.trim(),
        clientEmail: data.client?.email || '',
        clientPhone: data.client?.telephone || '',
        lines: lignes,
        total: data.totalTTC || 0,
        notes: data.notes || '',
        conditionsPaiement: data.conditions || '',
      };
    } else if (type === 'facture') {
      data = await prisma.facture.findUnique({
        where: { id: parseInt(id) },
        include: {
          client: true,
        },
      });

      if (!data) {
        return NextResponse.json(
          { message: 'Facture non trouvée' },
          { status: 404 }
        );
      }

      // Traitement sécurisé des lignes de facture
      let lignes = [];
      try {
        if (data.lignes) {
          if (typeof data.lignes === 'string') {
            try {
              lignes = JSON.parse(data.lignes);
            } catch (e) {
              console.error('Erreur parsing lignes de facture:', e);
              lignes = [];
            }
          } else if (Array.isArray(data.lignes)) {
            lignes = data.lignes;
          }
        }
      } catch (error) {
        console.error('Erreur lors du traitement des lignes de facture:', error);
        lignes = [];
      }

      // S'assurer que les lignes ont le bon format
      lignes = lignes.map(ligne => ({
        description: ligne.description || 'Article',
        quantite: Number(ligne.quantite) || 1,
        unite: ligne.unite || 'unité',
        prixUnitaire: Number(ligne.prixUnitaire) || 0,
        total: Number(ligne.total) || 0
      }));

      // Créer un objet formaté avec des valeurs par défaut pour éviter les erreurs
      formattedData = {
        type: 'facture',
        reference: data.numero || `#${data.id}`,
        date: data.date ? data.date.toISOString() : new Date().toISOString(),
        echeance: data.echeance ? data.echeance.toISOString() : undefined,
        clientName: data.client?.nom || 'Client',
        clientAddress: data.client?.adresse || '',
        clientZipCity: `${data.client?.codePostal || ''} ${data.client?.ville || ''}`.trim(),
        clientEmail: data.client?.email || '',
        clientPhone: data.client?.telephone || '',
        lines: lignes,
        total: data.totalTTC || 0,
        notes: data.notes || '',
        conditionsPaiement: data.conditions || '',
      };
    } else if (type === 'paiement') {
      data = await prisma.paiement.findUnique({
        where: { id: parseInt(id) },
        include: {
          client: true,
          facture: true,
        },
      });

      if (!data) {
        return NextResponse.json(
          { message: 'Paiement non trouvé' },
          { status: 404 }
        );
      }

      // Créer une ligne sécurisée pour le paiement
      const paiementDescription = data.facture 
        ? `Paiement pour facture ${data.facture.numero || `#${data.factureId}`}`
        : 'Paiement';

      formattedData = {
        type: 'paiement',
        reference: data.reference || `Paiement #${data.id}`,
        date: data.date ? data.date.toISOString() : new Date().toISOString(),
        clientName: data.client?.nom || `Client #${data.clientId || 'inconnu'}`,
        clientEmail: data.client?.email || '',
        clientAddress: data.client?.adresse || '',
        clientZipCity: `${data.client?.codePostal || ''} ${data.client?.ville || ''}`.trim(),
        clientPhone: data.client?.telephone || '',
        lines: [{
          description: paiementDescription,
          quantite: 1,
          unite: data.methode || 'Non précisée',
          prixUnitaire: Number(data.montant) || 0,
          total: Number(data.montant) || 0
        }],
        total: Number(data.montant) || 0,
        notes: data.notes || '',
        conditionsPaiement: `Paiement reçu par ${data.methode || 'mode de paiement non précisé'}${data.referenceTransaction ? ` - Référence: ${data.referenceTransaction}` : ''}`,
      };
    }

    // Journaliser les données pour débogage
    console.log('Données formatées pour impression:', JSON.stringify(formattedData));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données d\'impression:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des données d\'impression' },
      { status: 500 }
    );
  }
} 