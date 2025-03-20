'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Composant pour extraire les paramètres et afficher l'erreur
function ErrorContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'Configuration':
          setError('Il y a un problème avec la configuration de l\'authentification.');
          break;
        case 'AccessDenied':
          setError('Vous n\'avez pas l\'autorisation d\'accéder à cette page.');
          break;
        case 'Verification':
          setError('Le lien de vérification a expiré ou a déjà été utilisé.');
          break;
        case 'CredentialsSignin':
          setError('Email ou mot de passe incorrect.');
          break;
        default:
          setError('Une erreur s\'est produite lors de l\'authentification.');
          break;
      }
    } else {
      setError('Erreur d\'authentification inconnue.');
    }
  }, [searchParams]);

  return (
    <>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Erreur d&apos;authentification
      </h2>
      {error && (
        <p className="mt-2 text-center text-red-600">
          {error}
        </p>
      )}
    </>
  );
}

// Composant d'attente pour le Suspense
function ErrorFallback() {
  return (
    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
      Chargement...
    </h2>
  );
}

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <div>
          <Suspense fallback={<ErrorFallback />}>
            <ErrorContent />
          </Suspense>
          <div className="mt-8 space-y-4">
            <div>
              <Link 
                href="/auth/login-static"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Essayer la connexion statique
              </Link>
            </div>
            <div>
              <Link 
                href="/reset"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Réinitialiser la session
              </Link>
            </div>
            <div>
              <Link 
                href="/"
                className="w-full flex justify-center text-sm text-gray-600 hover:text-indigo-600"
              >
                Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 