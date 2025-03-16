import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/parametres - Récupérer les paramètres de l'entreprise
export async function GET() {
  try {
    // Récupérer les paramètres existants ou créer un enregistrement par défaut
    let parametres = await prisma.parametres.findFirst();

    if (!parametres) {
      parametres = await prisma.parametres.create({
        data: {
          nomEntreprise: 'Mon Entreprise',
          adresse: '1 rue de l\'exemple',
          codePostal: '75000',
          ville: 'Paris',
          email: 'contact@monentreprise.fr',
          siret: '00000000000000',
          conditionsPaiement: 'Paiement à 30 jours',
        },
      });
    }

    return NextResponse.json(parametres);
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des paramètres' },
      { status: 500 }
    );
  }
}

// PUT /api/parametres - Mettre à jour les paramètres de l'entreprise
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    // Validation des données
    const { nomEntreprise, adresse, codePostal, ville, email } = data;
    if (!nomEntreprise || !adresse || !codePostal || !ville || !email) {
      return NextResponse.json(
        { message: 'Données invalides. Nom de l\'entreprise, adresse, code postal, ville et email sont requis' },
        { status: 400 }
      );
    }

    // Récupérer les paramètres existants ou créer un enregistrement par défaut
    let parametres = await prisma.parametres.findFirst();

    if (!parametres) {
      // Créer les paramètres s'ils n'existent pas
      parametres = await prisma.parametres.create({
        data: {
          nomEntreprise,
          adresse,
          codePostal,
          ville,
          telephone: data.telephone,
          email,
          siret: data.siret,
          tva: data.tva,
          prefixeDevis: data.prefixeDevis || 'D-',
          prefixeFacture: data.prefixeFacture || 'F-',
          conditionsPaiement: data.conditionsPaiement || 'Paiement à 30 jours',
          mentionsTVA: data.mentionsTVA,
          textePiedPage: data.textePiedPage,
          emailExpediteur: data.emailExpediteur,
          objetDevis: data.objetDevis,
          objetFacture: data.objetFacture,
          messageDevis: data.messageDevis,
          messageFacture: data.messageFacture,
          iban: data.iban,
          bic: data.bic,
          nomBanque: data.nomBanque,
          titulaire: data.titulaire,
        },
      });
    } else {
      // Mettre à jour les paramètres existants
      parametres = await prisma.parametres.update({
        where: { id: parametres.id },
        data: {
          nomEntreprise,
          adresse,
          codePostal,
          ville,
          telephone: data.telephone,
          email,
          siret: data.siret,
          tva: data.tva,
          prefixeDevis: data.prefixeDevis,
          prefixeFacture: data.prefixeFacture,
          conditionsPaiement: data.conditionsPaiement,
          mentionsTVA: data.mentionsTVA,
          textePiedPage: data.textePiedPage,
          emailExpediteur: data.emailExpediteur,
          objetDevis: data.objetDevis,
          objetFacture: data.objetFacture,
          messageDevis: data.messageDevis,
          messageFacture: data.messageFacture,
          iban: data.iban,
          bic: data.bic,
          nomBanque: data.nomBanque,
          titulaire: data.titulaire,
        },
      });
    }

    return NextResponse.json(parametres);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour des paramètres' },
      { status: 500 }
    );
  }
} 