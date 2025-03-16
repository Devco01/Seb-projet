import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configuration pour le mode standalone
export const dynamic = 'force-dynamic';

// POST /api/parametres/logo - Télécharger un logo
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('logo') as File;

    if (!file) {
      return NextResponse.json(
        { message: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'Le fichier doit être une image' },
        { status: 400 }
      );
    }

    // Lire le contenu du fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Générer un nom de fichier unique
    const fileName = `logo-${uuidv4()}.${file.name.split('.').pop()}`;
    const filePath = join(process.cwd(), 'public', 'uploads', fileName);

    // Écrire le fichier sur le disque
    await writeFile(filePath, buffer);

    // Mettre à jour les paramètres avec le nouveau logo
    const parametres = await prisma.parametres.findFirst();
    
    if (parametres) {
      await prisma.parametres.update({
        where: { id: parametres.id },
        data: {
          logo: `/uploads/${fileName}`,
        },
      });
    } else {
      await prisma.parametres.create({
        data: {
          nomEntreprise: 'Mon Entreprise',
          adresse: '1 rue de l\'exemple',
          codePostal: '75000',
          ville: 'Paris',
          pays: 'France',
          email: 'contact@monentreprise.fr',
          siret: '00000000000000',
          conditionsPaiement: 'Paiement à 30 jours',
          logo: `/uploads/${fileName}`,
        },
      });
    }

    return NextResponse.json({ 
      message: 'Logo téléchargé avec succès',
      logo: `/uploads/${fileName}`,
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement du logo:', error);
    return NextResponse.json(
      { message: 'Erreur lors du téléchargement du logo' },
      { status: 500 }
    );
  }
} 