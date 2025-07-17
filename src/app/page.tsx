"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      // Attendre que la session soit chargée
      return;
    }

    if (session) {
      // Si l'utilisateur est connecté, rediriger vers le dashboard
      router.replace('/dashboard');
    } else {
      // Si l'utilisateur n'est pas connecté, rediriger vers la page de login
      router.replace('/auth/login');
    }
  }, [session, status, router]);

  // Afficher un loader pendant la vérification de la session
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  );
} 