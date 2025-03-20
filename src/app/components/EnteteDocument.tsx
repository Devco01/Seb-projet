'use client';

import { useEffect, useState } from 'react';

interface EnteteDocumentProps {
  title: string;
  subtitle?: string;
  showLegalInfo?: boolean;
}

interface ParametresEntreprise {
  companyName: string;
  address: string;
  zipCode: string;
  city: string;
  phone?: string;
  email: string;
  siret?: string;
  logoUrl?: string;
}

export default function EnteteDocument({ title, subtitle, showLegalInfo = true }: EnteteDocumentProps) {
  const [parametres, setParametres] = useState<ParametresEntreprise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParametres = async () => {
      try {
        const response = await fetch('/api/parametres');
        if (response.ok) {
          const data = await response.json();
          setParametres(data);
        } else {
          console.error('Erreur lors du chargement des paramètres');
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParametres();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-16">
        <div className="animate-pulse bg-gray-200 rounded h-12 w-48"></div>
      </div>
    );
  }

  // Paramètres par défaut si rien n'est configuré
  const defaultParams: ParametresEntreprise = {
    companyName: 'Mon Entreprise',
    address: '123 Rue Example',
    zipCode: '75000',
    city: 'Paris',
    email: 'contact@exemple.fr',
    phone: '01 23 45 67 89',
    siret: '000 000 000 00000'
  };

  const entreprise = parametres || defaultParams;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 print:mb-10">
      <div className="mb-4 sm:mb-0">
        {entreprise.logoUrl ? (
          <img 
            src={entreprise.logoUrl} 
            alt={`Logo ${entreprise.companyName}`} 
            className="h-16 object-contain"
          />
        ) : (
          <h3 className="text-xl font-bold text-blue-800">{entreprise.companyName}</h3>
        )}
        {showLegalInfo && (
          <div className="text-xs text-gray-600 mt-2 space-y-1">
            <p>{entreprise.address}, {entreprise.zipCode} {entreprise.city}</p>
            <p>Email: {entreprise.email} {entreprise.phone && `- Tél: ${entreprise.phone}`}</p>
            {entreprise.siret && <p>SIRET: {entreprise.siret}</p>}
            <p className="font-medium">Auto-entrepreneur</p>
          </div>
        )}
      </div>
      
      <div className="text-right">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
    </div>
  );
} 