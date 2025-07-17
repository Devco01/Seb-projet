'use client';

import { useEffect, useState } from 'react';

interface EnteteDocumentProps {
  title: string;
  subtitle?: string;
  showLegalInfo?: boolean;
}

interface ParametresEntreprise {
  nomEntreprise?: string;
  companyName?: string;
  adresse?: string;
  address?: string;
  codePostal?: string;
  zipCode?: string;
  ville?: string;
  city?: string;
  telephone?: string;
  phone?: string;
  email: string;
  siret?: string;
  logo?: string;
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
    nomEntreprise: 'Mon Entreprise',
    companyName: 'Mon Entreprise',
    adresse: '123 Rue Example',
    address: '123 Rue Example',
    codePostal: '75000',
    zipCode: '75000',
    ville: 'Paris',
    city: 'Paris',
    email: 'contact@exemple.fr',
    telephone: '01 23 45 67 89',
    phone: '01 23 45 67 89',
    siret: '000 000 000 00000'
  };

  const entreprise = parametres || defaultParams;
  
  // Normaliser les champs pour compatibilité
  const nomEntreprise = entreprise.nomEntreprise || entreprise.companyName || defaultParams.companyName;
  const adresse = entreprise.adresse || entreprise.address || defaultParams.address;
  const codePostal = entreprise.codePostal || entreprise.zipCode || defaultParams.zipCode;
  const ville = entreprise.ville || entreprise.city || defaultParams.city;
  const telephone = entreprise.telephone || entreprise.phone || defaultParams.phone;
  const logoPath = entreprise.logo || entreprise.logoUrl;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 print:mb-10">
      <div className="mb-4 sm:mb-0">
        {logoPath ? (
          <img 
            src={logoPath} 
            alt={`Logo ${nomEntreprise}`} 
            className="h-16 max-w-xs object-contain print:max-w-full"
          />
        ) : (
          <h3 className="text-xl font-bold text-blue-800">{nomEntreprise}</h3>
        )}
        {showLegalInfo && (
          <div className="text-xs text-gray-600 mt-2 space-y-1">
            <p>{adresse}, {codePostal} {ville}</p>
            <p>Email: {entreprise.email} {telephone && `- Tél: ${telephone}`}</p>
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