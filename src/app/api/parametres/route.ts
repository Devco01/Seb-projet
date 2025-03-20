import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from "zod";
import fs from "fs";
import path from "path";
import { Prisma } from '@prisma/client';

// Désactiver les règles ESLint pour ce fichier spécifique
/* eslint-disable @typescript-eslint/ban-ts-comment */

// Schéma de validation pour les paramètres
const ParametresSchema = z.object({
  companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  zipCode: z.string().min(1, "Le code postal est requis"),
  city: z.string().min(1, "La ville est requise"),
  phone: z.string().optional().nullable(),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  siret: z.string().optional().nullable(),
  paymentDelay: z.number().default(30),
  prefixeDevis: z.string().default("D-"),
  prefixeFacture: z.string().default("F-"),
  mentionsLegalesDevis: z.string().nullable().optional(),
  mentionsLegalesFacture: z.string().nullable().optional(),
  conditionsPaiement: z.string().nullable().optional(),
  logoUrl: z.string().nullable().optional(),
});

// Répertoire pour stocker les logos
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Vérifier si le répertoire existe, sinon le créer
try {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
} catch (error) {
  console.error("[API] Erreur lors de la création du répertoire uploads:", error);
}

// Type pour l'API
type ParametresAPI = {
  id?: number;
  companyName: string;
  address: string;
  zipCode: string;
  city: string;
  phone: string | null;
  email: string;
  siret: string | null;
  paymentDelay: number;
  prefixeDevis: string;
  prefixeFacture: string;
  mentionsLegalesDevis: string | null;
  mentionsLegalesFacture: string | null;
  conditionsPaiement: string | null;
  logoUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Fonction pour adapter les données de Prisma à l'API
function adaptPrismaToAPI(prismaData: any): ParametresAPI {
  return {
    id: prismaData.id,
    companyName: prismaData.companyName || prismaData.nomEntreprise,
    address: prismaData.address || prismaData.adresse,
    zipCode: prismaData.zipCode || prismaData.codePostal,
    city: prismaData.city || prismaData.ville,
    phone: prismaData.phone || prismaData.telephone || null,
    email: prismaData.email,
    siret: prismaData.siret || null,
    paymentDelay: prismaData.paymentDelay || prismaData.delaiPaiement || 30,
    prefixeDevis: prismaData.prefixeDevis,
    prefixeFacture: prismaData.prefixeFacture,
    mentionsLegalesDevis: prismaData.mentionsLegalesDevis || null,
    mentionsLegalesFacture: prismaData.mentionsLegalesFacture || null,
    conditionsPaiement: prismaData.conditionsPaiement || null,
    logoUrl: prismaData.logoUrl ? `/uploads/${prismaData.logoUrl}` : null,
    createdAt: prismaData.createdAt,
    updatedAt: prismaData.updatedAt
  };
}

// Fonction pour adapter les données de l'API à Prisma
function adaptAPIToPrisma(apiData: any): any {
  return {
    // Supporter à la fois les noms en anglais et en français
    companyName: apiData.companyName,
    nomEntreprise: apiData.companyName,
    address: apiData.address,
    adresse: apiData.address,
    zipCode: apiData.zipCode,
    codePostal: apiData.zipCode,
    city: apiData.city,
    ville: apiData.city,
    phone: apiData.phone,
    telephone: apiData.phone,
    email: apiData.email,
    siret: apiData.siret,
    paymentDelay: apiData.paymentDelay,
    delaiPaiement: apiData.paymentDelay,
    prefixeDevis: apiData.prefixeDevis,
    prefixeFacture: apiData.prefixeFacture,
    mentionsLegalesDevis: apiData.mentionsLegalesDevis,
    mentionsLegalesFacture: apiData.mentionsLegalesFacture,
    conditionsPaiement: apiData.conditionsPaiement,
    logoUrl: apiData.logoUrl ? apiData.logoUrl.replace('/uploads/', '') : null
  };
}

// GET /api/parametres - Récupérer les paramètres de l'entreprise
export async function GET() {
  console.log("[API] GET /api/parametres - Début");
  try {
    // Rechercher les paramètres dans la base de données
    const parametres = await prisma.parametres.findFirst();
    console.log("[API] Paramètres trouvés:", parametres ? "oui" : "non");

    if (!parametres) {
      console.log("[API] Aucun paramètre trouvé, retour 404");
      return NextResponse.json({ error: "Aucun paramètre trouvé" }, { status: 404 });
    }

    // Convertir les données vers le format API
    const responseData = adaptPrismaToAPI(parametres);

    console.log("[API] Réponse envoyée avec succès");
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("[API] Erreur lors de la récupération des paramètres:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des paramètres" },
      { status: 500 }
    );
  }
}

// POST /api/parametres - Mettre à jour les paramètres de l'entreprise
export async function POST(request: NextRequest) {
  console.log("[API] POST /api/parametres - Début");
  try {
    const formData = await request.formData();
    console.log("[API] FormData reçue");

    // Extraire les données du formulaire
    const data = Object.fromEntries(formData.entries());
    console.log("[API] Données extraites:", data);

    // Conversion des types pour validation
    const validationData = {
      companyName: String(data.companyName || ""),
      address: String(data.address || ""),
      zipCode: String(data.zipCode || ""),
      city: String(data.city || ""),
      phone: data.phone ? String(data.phone) : null,
      email: String(data.email || ""),
      siret: data.siret ? String(data.siret) : null,
      paymentDelay: parseInt(String(data.paymentDelay || "30")),
      prefixeDevis: String(data.prefixeDevis || "D-"),
      prefixeFacture: String(data.prefixeFacture || "F-"),
      mentionsLegalesDevis: data.mentionsLegalesDevis ? String(data.mentionsLegalesDevis) : null,
      mentionsLegalesFacture: data.mentionsLegalesFacture ? String(data.mentionsLegalesFacture) : null,
      conditionsPaiement: data.conditionsPaiement ? String(data.conditionsPaiement) : null,
    };

    // Valider les données
    try {
      ParametresSchema.parse(validationData);
      console.log("[API] Données validées");
    } catch (error) {
      console.error("[API] Erreur de validation:", error);
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    // Gérer le logo s'il est présent
    const logoFile = formData.get("logo") as File | null;
    let logoFileName = undefined;
    
    if (logoFile && logoFile.size > 0) {
      try {
        console.log("[API] Logo reçu, taille:", logoFile.size);
        const fileExtension = logoFile.name.split('.').pop() || 'png';
        logoFileName = `logo_${Date.now()}.${fileExtension}`;
        const filePath = path.join(UPLOAD_DIR, logoFileName);
        
        const buffer = Buffer.from(await logoFile.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        console.log("[API] Logo enregistré:", filePath);
      } catch (error) {
        console.error("[API] Erreur lors de l'enregistrement du logo:", error);
        // On continue malgré l'erreur du logo
      }
    } else {
      console.log("[API] Pas de nouveau logo");
    }

    // Vérifier si des paramètres existent déjà
    const existingParametres = await prisma.parametres.findFirst();
    console.log("[API] Paramètres existants:", existingParametres ? "oui" : "non");

    // Adapter les données pour Prisma
    const apiData = { ...validationData };
    if (logoFileName) {
      apiData.logoUrl = logoFileName;
    }
    const prismaData = adaptAPIToPrisma(apiData);

    // Créer ou mettre à jour les paramètres
    let result;
    try {
      if (existingParametres) {
        result = await prisma.parametres.update({
          where: { id: existingParametres.id },
          data: prismaData,
        });
        console.log("[API] Paramètres mis à jour");
      } else {
        result = await prisma.parametres.create({
          data: prismaData,
        });
        console.log("[API] Paramètres créés");
      }
    } catch (error) {
      console.error("[API] Erreur prisma détaillée:", error);
      throw error; // Re-lancer pour la gestion d'erreur globale
    }

    // Convertir les données retournées vers l'API
    const responseData = adaptPrismaToAPI(result);

    // Retourner les paramètres mis à jour
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("[API] Erreur lors de la création/mise à jour des paramètres:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création/mise à jour des paramètres" },
      { status: 500 }
    );
  }
}

// PUT /api/parametres - Mettre à jour tous les paramètres de l'entreprise
export async function PUT(request: NextRequest) {
  return POST(request);
}