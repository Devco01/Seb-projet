'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '../../lib/utils';

interface InvoiceHeaderProps {
  invoiceNumber: string;
  issueDate: string | Date;
  dueDate?: string | Date;
  reference?: string;
}

interface ParametresEntreprise {
  nom?: string;
  adresse?: string;
  codePostal?: string;
  ville?: string;
  telephone?: string;
  email?: string;
  siteWeb?: string;
  siret?: string;
  logo?: string;
}

/**
 * En-tête de facture conforme aux normes françaises pour les auto-entrepreneurs
 * Affiche toutes les mentions légales obligatoires
 */
export function InvoiceHeader({ 
  invoiceNumber, 
  issueDate, 
  dueDate, 
  reference 
}: InvoiceHeaderProps) {
  const [parametres, setParametres] = useState<ParametresEntreprise>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParametres();
  }, []);

  const fetchParametres = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/parametres');
      if (response.ok) {
        const data = await response.json();
        setParametres(data);
      } else {
        console.error('Erreur lors de la récupération des paramètres');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Valeurs par défaut si aucun paramètre configuré
  const nomEntreprise = parametres.nom || 'Votre Entreprise';
  const adresseEntreprise = parametres.adresse || '123 Rue Exemple';
  const codePostalEtVille = `${parametres.codePostal || '75000'} ${parametres.ville || 'Paris'}`;
  const telephoneEntreprise = parametres.telephone || '01 23 45 67 89';
  const emailEntreprise = parametres.email || 'contact@entreprise.fr';
  const siretEntreprise = parametres.siret || '123 456 789 00012';
  
  if (loading) {
    return (
      <div className="animate-pulse bg-gray-100 p-6 rounded-md mb-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/5 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-md shadow-sm mb-6">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{nomEntreprise}</h1>
          <address className="not-italic mt-2 text-gray-600">
            <p>{adresseEntreprise}</p>
            <p>{codePostalEtVille}</p>
            <p>Tél: {telephoneEntreprise}</p>
            <p>Email: {emailEntreprise}</p>
            <p className="mt-2">SIRET: {siretEntreprise}</p>
            <p className="text-sm font-medium mt-1">Auto-entrepreneur</p>
          </address>
        </div>

        <div className="mt-6 md:mt-0 md:text-right">
          <h2 className="text-xl font-semibold text-gray-700">Facture N° {invoiceNumber}</h2>
          <div className="mt-2 text-gray-600">
            <p>Date d&apos;émission: {formatDate(issueDate)}</p>
            {dueDate && <p>Date d&apos;échéance: {formatDate(dueDate)}</p>}
            {reference && <p>Référence: {reference}</p>}
          </div>
        </div>
      </div>
    </div>
  );
} 