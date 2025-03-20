'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// Composant pour le contenu du login qui utilise useSearchParams
function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
  
  // Utilisation de useEffect pour la redirection
  useEffect(() => {
    if (status === 'authenticated') {
      console.log("Redirection vers:", callbackUrl);
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);
  
  // Afficher un écran de chargement si déjà connecté
  if (status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-2xl font-bold">Vous êtes déjà connecté</h2>
          <p className="mt-2">Redirection en cours vers {callbackUrl}...</p>
          <div className="animate-spin mx-auto mt-6 h-12 w-12 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        username: email,
        password,
        redirect: false,
        callbackUrl: callbackUrl
      });

      if (result?.error) {
        setError('Identifiants incorrects');
      } else if (result?.ok) {
        setIsSuccess(true);
        console.log("Connexion réussie, redirection prévue vers:", callbackUrl);
        // La redirection se fera automatiquement via useEffect quand le statut sera mis à jour
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-2xl font-bold text-green-600">Connexion réussie!</h2>
          <p>Redirection en cours vers {callbackUrl}...</p>
          <div className="animate-spin mx-auto mt-6 h-12 w-12 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion à FacturePro
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Identifiant
              </label>
              <input
                id="email"
                name="email"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Identifiant"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75"
            >
              {isLoading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : null}
              Se connecter
            </button>
            
            <Link
              href="/reset"
              className="text-center text-sm text-gray-600 hover:text-indigo-600"
            >
              Problèmes de connexion? Cliquez ici pour réinitialiser
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// Fallback pour le composant Suspense
function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-2xl font-bold">Chargement...</h2>
        <div className="animate-spin mx-auto mt-6 h-12 w-12 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
      </div>
    </div>
  );
}

// Composant principal qui utilise Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
} 