import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilitaire pour combiner des classes CSS avec clsx et tailwind-merge
 * Permet de fusionner des classes conditionnelles et de résoudre les conflits
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatte un montant en euros selon les normes françaises
 */
export function formatEuros(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return '0,00 €';

  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(num);
}

/**
 * Formatte une date selon le format français (JJ/MM/AAAA)
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '';

  const d = date instanceof Date ? date : new Date(date);

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(d);
}

/**
 * Convertit une date au format français (JJ/MM/AAAA) en objet Date
 */
export function parseFrenchDate(dateString: string): Date | null {
  if (!dateString) return null;

  const parts = dateString.split('/');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Les mois sont indexés à partir de 0
  const year = parseInt(parts[2], 10);

  return new Date(year, month, day);
}

/**
 * Raccourcit un texte à une longueur maximale et ajoute des points de suspension
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
} 