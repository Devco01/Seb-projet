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
        reference: data.numero,
        date: data.date.toISOString(),
        echeance: data.validite.toISOString(),
        clientName: data.client?.nom || '',
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
        type: 'facture',
        reference: data.numero,
        date: data.date.toISOString(),
        echeance: data.echeance.toISOString(),
        clientName: data.client?.nom || '',
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

      formattedData = {
        type: 'paiement',
        reference: data.reference,
        date: data.date.toISOString(),
        clientName: data.client?.nom || `Client #${data.clientId}`,
        clientEmail: data.client?.email || '',
        lines: [{
          description: `Paiement pour facture ${data.facture?.numero || `#${data.factureId}`}`,
          quantite: 1,
          unite: data.methode,
          prixUnitaire: data.montant,
          total: data.montant
        }],
        total: data.montant,
        notes: data.notes || '',
        conditionsPaiement: `Paiement reçu par ${data.methode}${data.referenceTransaction ? ` - Référence: ${data.referenceTransaction}` : ''}`,
      };
    }

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données d\'impression:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des données d\'impression' },
      { status: 500 }
    );
  }
} 