'use client';

import Image from 'next/image';
import useParametres from '@/hooks/useParametres';

interface EnteteDocumentProps {
  title: string;
  subtitle?: string;
}

export default function EnteteDocument({ title, subtitle }: EnteteDocumentProps) {
  const { parametres, loading } = useParametres();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-gray-200 rounded-md mb-4"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
      <div className="flex items-center mb-4 md:mb-0">
        {parametres?.logo ? (
          <div className="relative w-16 h-16 mr-4">
            <Image 
              src={parametres.logo} 
              alt={parametres.nomEntreprise || 'Logo entreprise'} 
              fill 
              sizes="64px"
              className="object-contain" 
            />
          </div>
        ) : null}
        
        <div>
          <h1 className="text-2xl font-bold text-blue-800">{title}</h1>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
      </div>
      
      <div className="text-right">
        <h2 className="font-semibold text-lg">{parametres?.nomEntreprise || 'Mon Entreprise'}</h2>
        <p className="text-sm text-gray-600">{parametres?.adresse || ''}</p>
        <p className="text-sm text-gray-600">
          {parametres?.codePostal || ''} {parametres?.ville || ''}
        </p>
        {parametres?.telephone && (
          <p className="text-sm text-gray-600">{parametres.telephone}</p>
        )}
        <p className="text-sm text-gray-600">{parametres?.email || ''}</p>
        {parametres?.siret && (
          <p className="text-sm text-gray-600">SIRET: {parametres.siret}</p>
        )}
      </div>
    </div>
  );
} 