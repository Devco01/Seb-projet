"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function HomePage() {
  const { status } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  // Effet pour marquer le composant comme monté
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Afficher un état de chargement jusqu'à ce que le composant soit monté
  if (!isMounted || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Afficher la page de connexion (même si l'utilisateur est authentifié)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">FacturePro</h1>
        
        <div className="space-y-4">
          <p className="text-gray-600">Bienvenue sur l&apos;application de gestion de factures et devis</p>
          
          <div className="mt-8 space-y-4">
            <Link 
              href="/api/auth/signin"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 