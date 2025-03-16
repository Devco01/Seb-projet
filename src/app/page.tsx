'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la page d'accueil alternative
    router.push('/accueil');
  }, [router]);

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">FacturePro - Peinture en bâtiment</h1>
      
      <div className="text-center mb-8">
        <p className="text-lg mb-4">
          Redirection en cours vers la page d'accueil alternative...
        </p>
        
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        
        <p>
          Si vous n'êtes pas redirigé automatiquement, veuillez cliquer sur le lien ci-dessous :
        </p>
        
        <Link href="/accueil" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block">
          Aller à la page d'accueil
        </Link>
      </div>
    </div>
  );
}
