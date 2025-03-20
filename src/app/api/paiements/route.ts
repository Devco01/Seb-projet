import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/paiements - Récupérer tous les paiements
export async function GET() {
  try {
    const paiements = await prisma.paiement.findMany({
      include: {
        client: {
          select: {
            id: true,
            nom: true,
            email: true,
          },
        },
        facture: {
          select: {
            id: true,
            numero: true,
            totalTTC: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(paiements);
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des paiements' },
      { status: 500 }
    );
  }
}

// POST /api/paiements - Créer un nouveau paiement
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Données reçues pour la création du paiement:', data);

    // Validation des données
    const { factureId, clientId, date, montant, methode } = data;
    if (!factureId || !clientId || !date || !montant || !methode) {
      console.error('Données manquantes:', { factureId, clientId, date, montant, methode });
      return NextResponse.json(
        { message: 'Données invalides. FactureId, clientId, date, montant et méthode sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si la facture existe
    const facture = await prisma.facture.findUnique({
      where: { id: factureId },
    });

    if (!facture) {
      console.error(`Facture non trouvée avec ID: ${factureId}`);
      return NextResponse.json(
        { message: 'Facture non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si le client existe
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      console.error(`Client non trouvé avec ID: ${clientId}`);
      return NextResponse.json(
        { message: 'Client non trouvé' },
        { status: 404 }
      );
    }

    // Générer une référence unique si non fournie
    let reference = data.reference;
    if (!reference) {
      // Créer une référence basée sur la date et un nombre aléatoire
      const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const randomStr = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      reference = `PAY-${dateStr}-${randomStr}`;
    }

    console.log(`Création d'un paiement avec référence: ${reference}`);

    // Formatter correctement la date au format ISO
    let formattedDate;
    try {
      // Si la date est au format YYYY-MM-DD, convertir en ISO DateTime
      if (date && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        formattedDate = new Date(`${date}T12:00:00Z`).toISOString();
      } else {
        // Si déjà au format ISO ou autre format
        formattedDate = new Date(date).toISOString();
      }
      console.log(`Date formatée: ${formattedDate}`);
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', error);
      return NextResponse.json(
        { message: 'Format de date invalide', details: error.message },
        { status: 400 }
      );
    }

    // Créer le paiement
    const nouveauPaiement = await prisma.paiement.create({
      data: {
        factureId,
        clientId,
        date: formattedDate,
        montant: parseFloat(montant.toString()),
        methode,
        reference,
        referenceTransaction: data.reference || null,
        notes: data.notes || '',
      },
    });

    console.log('Paiement créé avec succès:', nouveauPaiement);

    // Mettre à jour le statut de la facture
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/factures/${factureId}/payer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error(`Erreur lors de la mise à jour du statut de la facture: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la facture:', error);
    }

    return NextResponse.json(nouveauPaiement, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création du paiement', details: error.message },
      { status: 500 }
    );
  }
} 