import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from "zod";
import fs from "fs";
import path from "path";

// Schéma de validation avec les champs obligatoires
const ParametresSchema = z.object({
  companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  paymentDelay: z.number().default(30),
  prefixeDevis: z.string().default("DEV-"),
  prefixeFacture: z.string().default("FACT-"),
  // Champs optionnels
  address: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  siret: z.string().optional(),
  mentionsLegalesDevis: z.string().optional(),
  mentionsLegalesFacture: z.string().optional(),
  conditionsPaiement: z.string().optional(),
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

    // Retourner les paramètres tels quels
    console.log("[API] Réponse envoyée avec succès");
    return NextResponse.json(parametres);
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
      email: String(data.email || ""),
      paymentDelay: parseInt(String(data.paymentDelay || "30")),
      prefixeDevis: String(data.prefixeDevis || "DEV-"),
      prefixeFacture: String(data.prefixeFacture || "FACT-"),
      // Champs optionnels avec valeurs par défaut vides
      address: String(data.address || ""),
      zipCode: String(data.zipCode || ""),
      city: String(data.city || ""),
      phone: String(data.phone || ""),
      siret: String(data.siret || ""),
      mentionsLegalesDevis: String(data.mentionsLegalesDevis || ""),
      mentionsLegalesFacture: String(data.mentionsLegalesFacture || ""),
      conditionsPaiement: String(data.conditionsPaiement || ""),
    };

    // Valider les données de base
    try {
      ParametresSchema.parse(validationData);
      console.log("[API] Données validées");
    } catch (error) {
      console.error("[API] Erreur de validation:", error);
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    // Gérer le logo s'il est présent
    const logoFile = formData.get("logo") as File | null;
    let logoUrl = undefined;
    
    if (logoFile && logoFile.size > 0) {
      try {
        console.log("[API] Logo reçu, taille:", logoFile.size);
        const fileExtension = logoFile.name.split('.').pop() || 'png';
        const logoFileName = `logo_${Date.now()}.${fileExtension}`;
        const filePath = path.join(UPLOAD_DIR, logoFileName);
        
        const buffer = Buffer.from(await logoFile.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        console.log("[API] Logo enregistré:", filePath);
        
        // Chemin relatif pour l'accès via l'API
        logoUrl = `/uploads/${logoFileName}`;
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

    // Créer un objet prismaData avec tous les champs
    const prismaData = {
      companyName: validationData.companyName,
      email: validationData.email,
      paymentDelay: validationData.paymentDelay,
      prefixeDevis: validationData.prefixeDevis,
      prefixeFacture: validationData.prefixeFacture,
      address: validationData.address,
      zipCode: validationData.zipCode,
      city: validationData.city,
      phone: validationData.phone,
      siret: validationData.siret,
      mentionsLegalesDevis: validationData.mentionsLegalesDevis || null,
      mentionsLegalesFacture: validationData.mentionsLegalesFacture || null,
      conditionsPaiement: validationData.conditionsPaiement || null,
    };

    // Ajouter le logo s'il est présent
    if (logoUrl) {
      // @ts-expect-error - Le champ logoUrl existe dans le schéma Prisma mais TypeScript ne le reconnaît pas
      prismaData.logoUrl = logoUrl;
    }

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
      throw error;
    }

    // Retourner les paramètres
    return NextResponse.json(result);
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