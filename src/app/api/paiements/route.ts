import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Configuration pour le mode standalone
export const dynamic = 'force-dynamic';

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

    // Validation des données
    const { factureId, clientId, date, montant, methode } = data;
    if (!factureId || !clientId || !date || !montant || !methode) {
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
      return NextResponse.json(
        { message: 'Client non trouvé' },
        { status: 404 }
      );
    }

    // Créer le paiement
    const nouveauPaiement = await prisma.paiement.create({
      data: {
        factureId,
        clientId,
        date,
        montant: parseFloat(montant.toString()),
        methode,
        reference: data.reference,
        notes: data.notes,
      },
    });

    // Mettre à jour le statut de la facture
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/factures/${factureId}/payer`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(nouveauPaiement);
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
} 