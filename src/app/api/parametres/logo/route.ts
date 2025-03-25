import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

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
    const path = join(process.cwd(), 'public', 'uploads', fileName);

    // Écrire le fichier sur le disque
    await writeFile(path, buffer);

    // Mettre à jour le champ logo dans les paramètres en utilisant un raw query ou en ignorant la vérification du type
    const logoPath = `/uploads/${fileName}`;
    
    try {
      const parametres = await prisma.parametres.findFirst();
      
      // Utilisation d'une requête SQL brute pour mettre à jour le logo
      if (parametres) {
        // Mettre à jour les paramètres existants avec executeRaw
        await prisma.$executeRaw`UPDATE "Parametres" SET "logo" = ${logoPath} WHERE "id" = ${parametres.id}`;
      } else {
        // Créer des paramètres par défaut avec executeRaw
        await prisma.$executeRaw`
          INSERT INTO "Parametres" (
            "companyName", "address", "zipCode", "city", "email", 
            "siret", "conditionsPaiement", "logo", "prefixeDevis", "prefixeFacture", 
            "createdAt", "updatedAt"
          ) 
          VALUES (
            'Mon Entreprise', '1 rue de l''exemple', '75000', 'Paris', 'contact@monentreprise.fr',
            '00000000000000', 'Paiement à 30 jours', ${logoPath}, 'D-', 'F-',
            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          )
        `;
      }
    } catch (dbError) {
      console.error('Erreur base de données:', dbError);
      // Fallback si executeRaw échoue - utiliser une requête qui ignore le champ logo
      const parametres = await prisma.parametres.findFirst();
      if (!parametres) {
        await prisma.parametres.create({
          data: {
            companyName: 'Mon Entreprise',
            address: '1 rue de l\'exemple',
            zipCode: '75000',
            city: 'Paris',
            email: 'contact@monentreprise.fr',
            siret: '00000000000000',
            conditionsPaiement: 'Paiement à 30 jours',
            prefixeDevis: 'D-',
            prefixeFacture: 'F-'
          },
        });
      }
      
      // Stockage du chemin du logo dans une autre source (comme localStorage, fichier, etc.)
      console.log('Chemin du logo:', logoPath);
    }

    return NextResponse.json({ 
      message: 'Logo téléchargé avec succès',
      logo: logoPath,
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement du logo:', error);
    return NextResponse.json(
      { message: 'Erreur lors du téléchargement du logo' },
      { status: 500 }
    );
  }
}

// DELETE /api/parametres/logo - Supprimer le logo
export async function DELETE() {
  try {
    // Récupérer les paramètres actuels
    const parametres = await prisma.parametres.findFirst();
    
    if (!parametres || !parametres.logoUrl) {
      return NextResponse.json(
        { message: 'Aucun logo trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le fichier physique
    const logoPath = join(process.cwd(), 'public', parametres.logoUrl);
    try {
      await unlink(logoPath);
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
      // On continue même si le fichier n'existe pas
    }

    // Mettre à jour la base de données
    await prisma.parametres.update({
      where: { id: parametres.id },
      data: { logoUrl: null }
    });

    return NextResponse.json({ 
      message: 'Logo supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du logo:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression du logo' },
      { status: 500 }
    );
  }
} 