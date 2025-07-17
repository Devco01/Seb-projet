import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

// POST /api/parametres/logo - Télécharger un logo
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('logo') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Le fichier doit être une image' },
        { status: 400 }
      );
    }

    // Vérifier la taille du fichier (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux (max 2MB)' },
        { status: 400 }
      );
    }

    try {
      // Convertir le fichier en buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Créer le répertoire uploads s'il n'existe pas
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Générer un nom de fichier unique
      const fileExtension = file.name.split('.').pop() || 'png';
      const fileName = `logo_${Date.now()}.${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);
      
      // Sauvegarder le fichier
      fs.writeFileSync(filePath, buffer);
      
      // URL relative pour accès web
      const logoUrl = `/uploads/${fileName}`;
      
      console.log('Logo sauvegardé localement:', logoUrl);
    
      // Mettre à jour le champ logo dans les paramètres
      try {
        const parametres = await prisma.parametres.findFirst();
        
        if (parametres) {
          await prisma.parametres.update({
            where: { id: parametres.id },
            data: { logoUrl: logoUrl } as any
          });
        } else {
          await prisma.parametres.create({
            data: {
              companyName: 'Mon Entreprise',
              address: '1 rue de l\'exemple',
              zipCode: '75000',
              city: 'Paris',
              email: 'contact@monentreprise.fr',
              phone: '01 23 45 67 89',
              siret: '00000000000000',
              conditionsPaiement: 'Paiement à 30 jours',
              prefixeDevis: 'D-',
              prefixeFacture: 'F-',
              logoUrl: logoUrl
            } as any,
          });
        }
      } catch (dbError) {
        console.error('Erreur base de données:', dbError);
        return NextResponse.json(
          { error: 'Erreur lors de la mise à jour des paramètres' },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        message: 'Logo téléchargé avec succès',
        logoUrl: logoUrl
      });
    } catch (uploadError) {
      console.error('Erreur lors de l\'upload du logo:', uploadError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'upload du logo' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur lors du téléchargement du logo:', error);
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement du logo' },
      { status: 500 }
    );
  }
}

// DELETE /api/parametres/logo - Supprimer le logo
export async function DELETE() {
  try {
    // Récupérer les paramètres actuels
    const parametres = await prisma.parametres.findFirst() as any;
    
    if (!parametres || !parametres.logoUrl) {
      return NextResponse.json(
        { error: 'Aucun logo trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le fichier local s'il existe
    if (parametres.logoUrl && parametres.logoUrl.startsWith('/uploads/')) {
      try {
        const filename = parametres.logoUrl.replace('/uploads/', '');
        const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
        
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log('Fichier logo supprimé:', filePath);
        }
      } catch (deleteError) {
        console.error('Erreur lors de la suppression du fichier:', deleteError);
        // On continue même si la suppression échoue
      }
    }

    // Mettre à jour la base de données
    await prisma.parametres.update({
      where: { id: parametres.id },
      data: { logoUrl: null } as any
    });

    return NextResponse.json({ 
      message: 'Logo supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du logo:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du logo' },
      { status: 500 }
    );
  }
} 