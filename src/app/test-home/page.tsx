'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TestHomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/test-home');
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue');
        console.error('Erreur de test:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Page de test d'accueil</h1>
      
      <div className="mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          Retour à l'accueil
        </Link>
        {' | '}
        <Link href="/diagnostic" className="text-blue-500 hover:underline">
          Voir le diagnostic
        </Link>
      </div>
      
      {loading && <p className="text-gray-600">Chargement des données...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
        </div>
      )}
      
      {data && (
        <div className="bg-white shadow-md rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Résultats du test</h2>
          
          <div className="mb-4">
            <h3 className="font-medium">Statut</h3>
            <p className={`${data.status === 'success' ? 'text-green-600' : 'text-red-600'} font-bold`}>
              {data.status === 'success' ? 'Succès' : 'Échec'}
            </p>
          </div>
          
          {data.status === 'success' ? (
            <>
              <div className="mb-4">
                <h3 className="font-medium">Connexion à la base de données</h3>
                <p className="text-green-600">Connecté avec succès</p>
                <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto">
                  {JSON.stringify(data.dbTest, null, 2)}
                </pre>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium">Clients (test)</h3>
                <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto">
                  {JSON.stringify(data.clients, null, 2)}
                </pre>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium">Variables d'environnement</h3>
                <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto">
                  {JSON.stringify(data.environment, null, 2)}
                </pre>
              </div>
            </>
          ) : (
            <div className="mb-4">
              <h3 className="font-medium">Message d'erreur</h3>
              <p className="text-red-600">{data.message}</p>
              {data.stack && (
                <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto">
                  {data.stack}
                </pre>
              )}
            </div>
          )}
          
          <div>
            <h3 className="font-medium">Horodatage</h3>
            <p>{new Date(data.timestamp).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
} 