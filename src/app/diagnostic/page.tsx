'use client';

import { useState, useEffect } from 'react';

export default function DiagnosticPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diagnosticData, setDiagnosticData] = useState<any>(null);

  useEffect(() => {
    async function runDiagnostic() {
      try {
        setLoading(true);
        const response = await fetch('/api/diagnostic');
        const data = await response.json();
        setDiagnosticData(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue');
        console.error('Erreur de diagnostic:', err);
      } finally {
        setLoading(false);
      }
    }

    runDiagnostic();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Page de diagnostic</h1>
      
      {loading && <p className="text-gray-600">Chargement des diagnostics...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
        </div>
      )}
      
      {diagnosticData && (
        <div className="bg-white shadow-md rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Résultats du diagnostic</h2>
          
          <div className="mb-4">
            <h3 className="font-medium">Statut</h3>
            <p className={`${diagnosticData.status === 'success' ? 'text-green-600' : 'text-red-600'} font-bold`}>
              {diagnosticData.status === 'success' ? 'Succès' : 'Échec'}
            </p>
          </div>
          
          {diagnosticData.status === 'success' ? (
            <>
              <div className="mb-4">
                <h3 className="font-medium">Connexion à la base de données</h3>
                <p className="text-green-600">Connecté avec succès</p>
                <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto">
                  {JSON.stringify(diagnosticData.dbTest, null, 2)}
                </pre>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium">Variables d'environnement</h3>
                <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto">
                  {JSON.stringify(diagnosticData.environment, null, 2)}
                </pre>
              </div>
            </>
          ) : (
            <div className="mb-4">
              <h3 className="font-medium">Message d'erreur</h3>
              <p className="text-red-600">{diagnosticData.message}</p>
              {diagnosticData.stack && (
                <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto">
                  {diagnosticData.stack}
                </pre>
              )}
            </div>
          )}
          
          <div>
            <h3 className="font-medium">Horodatage</h3>
            <p>{new Date(diagnosticData.timestamp).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
} 