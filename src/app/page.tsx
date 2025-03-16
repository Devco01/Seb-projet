'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers le dashboard
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          FacturePro
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Redirection vers le tableau de bord...
        </p>
        <div className="mt-8 animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <div className="mt-8">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Cliquez ici si vous n'êtes pas redirigé automatiquement
          </Link>
        </div>
      </div>
    </div>
  );
}
