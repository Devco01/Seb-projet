import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from "zod";
import fs from "fs";
import path from "path";

// Schéma de validation pour les paramètres
const ParametresSchema = z.object({
  companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  zipCode: z.string().min(1, "Le code postal est requis"),
  city: z.string().min(1, "La ville est requise"),
  phone: z.string().optional(),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  siret: z.string().optional(),
  paymentDelay: z.number().default(30),
  tvaPercent: z.number().default(0),
  prefixeDevis: z.string().default("D-"),
  prefixeFacture: z.string().default("F-"),
  mentionsLegalesDevis: z.string().nullable(),
  mentionsLegalesFacture: z.string().nullable(),
  conditionsPaiement: z.string().nullable(),
  logoUrl: z.string().nullable().optional(),
});

// Répertoire pour stocker les logos
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Vérifier si le répertoire existe, sinon le créer
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
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

    // @ts-ignore - Ignorer les erreurs TypeScript liées aux noms de propriétés
    const responseData = {
      id: parametres.id,
      companyName: parametres.companyName,
      address: parametres.address,
      zipCode: parametres.zipCode,
      city: parametres.city,
      phone: parametres.phone || "",
      email: parametres.email,
      siret: parametres.siret || "",
      paymentDelay: parametres.paymentDelay,
      tvaPercent: parametres.tvaPercent,
      prefixeDevis: parametres.prefixeDevis,
      prefixeFacture: parametres.prefixeFacture,
      mentionsLegalesDevis: parametres.mentionsLegalesDevis,
      mentionsLegalesFacture: parametres.mentionsLegalesFacture,
      conditionsPaiement: parametres.conditionsPaiement,
      logoUrl: parametres.logoUrl ? `/uploads/${parametres.logoUrl}` : null,
      createdAt: parametres.createdAt,
      updatedAt: parametres.updatedAt
    };

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
      phone: String(data.phone || ""),
      email: String(data.email || ""),
      siret: String(data.siret || ""),
      paymentDelay: parseInt(String(data.paymentDelay || "30")),
      tvaPercent: parseFloat(String(data.tvaPercent || "0")),
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
      console.log("[API] Logo reçu, taille:", logoFile.size);
      const fileExtension = logoFile.name.split('.').pop() || 'png';
      logoFileName = `logo_${Date.now()}.${fileExtension}`;
      const filePath = path.join(UPLOAD_DIR, logoFileName);
      
      const buffer = Buffer.from(await logoFile.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      console.log("[API] Logo enregistré:", filePath);
    } else {
      console.log("[API] Pas de nouveau logo");
    }

    // Vérifier si des paramètres existent déjà
    const existingParametres = await prisma.parametres.findFirst();
    console.log("[API] Paramètres existants:", existingParametres ? "oui" : "non");

    // Créer ou mettre à jour les paramètres
    let result;
    if (existingParametres) {
      // Mise à jour avec ou sans logo
      // @ts-ignore - Ignorer les erreurs TypeScript
      result = await prisma.parametres.update({
        where: { id: existingParametres.id },
        data: {
          companyName: validationData.companyName,
          address: validationData.address,
          zipCode: validationData.zipCode,
          city: validationData.city,
          phone: validationData.phone,
          email: validationData.email,
          siret: validationData.siret,
          paymentDelay: validationData.paymentDelay,
          tvaPercent: validationData.tvaPercent,
          prefixeDevis: validationData.prefixeDevis,
          prefixeFacture: validationData.prefixeFacture,
          mentionsLegalesDevis: validationData.mentionsLegalesDevis,
          mentionsLegalesFacture: validationData.mentionsLegalesFacture,
          conditionsPaiement: validationData.conditionsPaiement,
          ...(logoFileName ? { logoUrl: logoFileName } : {})
        },
      });
      console.log("[API] Paramètres mis à jour");
    } else {
      // Création avec ou sans logo
      // @ts-ignore - Ignorer les erreurs TypeScript
      result = await prisma.parametres.create({
        data: {
          companyName: validationData.companyName,
          address: validationData.address,
          zipCode: validationData.zipCode,
          city: validationData.city,
          phone: validationData.phone,
          email: validationData.email,
          siret: validationData.siret,
          paymentDelay: validationData.paymentDelay,
          tvaPercent: validationData.tvaPercent,
          prefixeDevis: validationData.prefixeDevis,
          prefixeFacture: validationData.prefixeFacture,
          mentionsLegalesDevis: validationData.mentionsLegalesDevis,
          mentionsLegalesFacture: validationData.mentionsLegalesFacture,
          conditionsPaiement: validationData.conditionsPaiement,
          logoUrl: logoFileName || null
        },
      });
      console.log("[API] Paramètres créés");
    }

    // Préparer la réponse
    // @ts-ignore - Ignorer les erreurs TypeScript
    const responseData = {
      ...result,
      logoUrl: result.logoUrl ? `/uploads/${result.logoUrl}` : null
    };

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