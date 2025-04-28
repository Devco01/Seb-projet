import { prisma } from '@/lib/prisma';

/**
 * Génère un numéro de facture unique au format F-YYYYMM-XXX
 */
export async function generateNumeroFacture(): Promise<string> {
  const date = new Date();
  const annee = date.getFullYear();
  const mois = (date.getMonth() + 1).toString().padStart(2, '0');
  
  // Récupérer le nombre de factures pour ce mois
  const compteur = await prisma.facture.count({
    where: {
      numero: {
        startsWith: `F-${annee}${mois}-`
      }
    }
  });
  
  // Incrémenter de 1 et formater avec des zéros
  const numeroSequentiel = (compteur + 1).toString().padStart(3, '0');
  
  // Format final: F-YYYYMM-XXX (ex: F-202311-001)
  return `F-${annee}${mois}-${numeroSequentiel}`;
}

/**
 * Génère un numéro de devis unique au format D-YYYYMM-XXX
 */
export async function generateNumeroDevis(): Promise<string> {
  const date = new Date();
  const annee = date.getFullYear();
  const mois = (date.getMonth() + 1).toString().padStart(2, '0');
  
  // Récupérer le nombre de devis pour ce mois
  const compteur = await prisma.devis.count({
    where: {
      numero: {
        startsWith: `D-${annee}${mois}-`
      }
    }
  });
  
  // Incrémenter de 1 et formater avec des zéros
  const numeroSequentiel = (compteur + 1).toString().padStart(3, '0');
  
  // Format final: D-YYYYMM-XXX (ex: D-202311-001)
  return `D-${annee}${mois}-${numeroSequentiel}`;
}

/**
 * Génère un numéro de paiement unique au format P-YYYYMM-XXX
 */
export async function generateNumeroPaiement(): Promise<string> {
  const date = new Date();
  const annee = date.getFullYear();
  const mois = (date.getMonth() + 1).toString().padStart(2, '0');
  
  // Récupérer le nombre de paiements pour ce mois
  const compteur = await prisma.paiement.count({
    where: {
      reference: {
        startsWith: `P-${annee}${mois}-`
      }
    }
  });
  
  // Incrémenter de 1 et formater avec des zéros
  const numeroSequentiel = (compteur + 1).toString().padStart(3, '0');
  
  // Format final: P-YYYYMM-XXX (ex: P-202311-001)
  return `P-${annee}${mois}-${numeroSequentiel}`;
} 