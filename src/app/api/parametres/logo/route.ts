import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { Readable } from 'stream';

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

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Uploader l'image sur Cloudinary
    const uploadOptions = {
      folder: 'facturepro/logos',
      public_id: `logo_${Date.now()}`,
      resource_type: 'image' as 'image' | 'video' | 'raw' | 'auto'
    };

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Erreur Cloudinary:', error);
            reject(error);
            return;
          }
          resolve(result);
        }
      );

      // Créer un stream lisible à partir du buffer
      const readableInstanceStream = new Readable({
        read() {
          this.push(buffer);
          this.push(null);
        }
      });

      readableInstanceStream.pipe(uploadStream);
    });

    // @ts-expect-error - Type incomplet pour le résultat de Cloudinary
    const logoUrl = result?.secure_url;
    
    if (!logoUrl) {
      return NextResponse.json(
        { message: 'Erreur lors de l\'upload sur Cloudinary' },
        { status: 500 }
      );
    }

    console.log('Logo uploadé avec succès:', logoUrl);
    
    // Mettre à jour le champ logo dans les paramètres
    try {
      const parametres = await prisma.parametres.findFirst();
      
      if (parametres) {
        await prisma.parametres.update({
          where: { id: parametres.id },
          data: { logoUrl: logoUrl }
        });
      } else {
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
            prefixeFacture: 'F-',
            logoUrl: logoUrl
          },
        });
      }
    } catch (dbError) {
      console.error('Erreur base de données:', dbError);
      return NextResponse.json(
        { message: 'Erreur lors de la mise à jour des paramètres' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Logo téléchargé avec succès',
      logoUrl: logoUrl
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

    // Supprimer l'image sur Cloudinary
    if (parametres.logoUrl.includes('cloudinary')) {
      try {
        // Extraire l'ID public
        const parts = parametres.logoUrl.split('/');
        const filename = parts[parts.length - 1];
        const publicId = `facturepro/logos/${filename.split('.')[0]}`;
        
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.error('Erreur lors de la suppression sur Cloudinary:', deleteError);
        // On continue même si la suppression échoue
      }
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