import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Télécharge une image sur Cloudinary
 * @param file Le fichier à télécharger
 * @param folder Le dossier où placer l'image
 * @returns L'URL de l'image téléchargée
 */
export const uploadImage = async (file: Buffer, folder = 'facturepro'): Promise<string> => {
  try {
    return new Promise((resolve, reject) => {
      // Stream pour télécharger l'image
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Erreur lors du téléchargement sur Cloudinary:', error);
            reject(error);
            return;
          }
          resolve(result?.secure_url || '');
        }
      );

      // Convertir le Buffer en Stream et l'envoyer à Cloudinary
      const readableStream = new Readable();
      readableStream.push(file);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement sur Cloudinary:', error);
    throw error;
  }
};

/**
 * Supprime une image de Cloudinary
 * @param url L'URL de l'image à supprimer
 */
export const deleteImage = async (url: string): Promise<void> => {
  try {
    if (!url || !url.includes('cloudinary')) {
      return;
    }

    // Extraire l'identifiant public de l'URL
    const parts = url.split('/');
    const publicIdWithExtension = parts[parts.length - 1];
    const publicIdParts = publicIdWithExtension.split('.');
    publicIdParts.pop(); // Enlever l'extension
    const folder = parts[parts.length - 2];
    const publicId = `${folder}/${publicIdParts.join('.')}`;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Erreur lors de la suppression sur Cloudinary:', error);
  }
};

export default cloudinary; 