'use client';

import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';

// Ajouter une déclaration de type pour la fenêtre
declare global {
  interface Window {
    __NEXT_DATA_MOUNTED?: boolean;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  // Utiliser un état pour vérifier si le composant est monté côté client
  const [mounted, setMounted] = useState(false);

  // Effectuer une vérification de montage au premier rendu côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Ne rien rendre côté serveur pour éviter les erreurs d'hydratation
  if (!mounted) {
    return (
      <div className="min-h-screen animate-pulse bg-gray-50">
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Une fois monté côté client, rendre normalement
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      {children}
    </>
  );
} 