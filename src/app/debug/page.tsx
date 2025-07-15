'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function DebugPage() {
  const { data: session, status } = useSession();
  const [envInfo, setEnvInfo] = useState<{
    url?: string;
    userAgent?: string;
    cookies?: string;
    timestamp?: string;
  }>({});

  useEffect(() => {
    // Récupérer les informations d'environnement côté client
    setEnvInfo({
      url: window.location.href,
      userAgent: navigator.userAgent,
      cookies: document.cookie,
      timestamp: new Date().toISOString()
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6">🔍 Page de diagnostic</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">📊 Statut de session</h2>
            <div className="bg-gray-100 p-4 rounded">
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Session:</strong> {session ? 'Connecté' : 'Non connecté'}</p>
              {session && (
                <pre className="mt-2 text-sm">{JSON.stringify(session, null, 2)}</pre>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">🌐 Informations environnement</h2>
            <div className="bg-gray-100 p-4 rounded">
              <p><strong>URL actuelle:</strong> {envInfo.url}</p>
              <p><strong>User Agent:</strong> {envInfo.userAgent}</p>
              <p><strong>Timestamp:</strong> {envInfo.timestamp}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">🍪 Cookies</h2>
            <div className="bg-gray-100 p-4 rounded">
              <pre className="text-sm whitespace-pre-wrap">{envInfo.cookies || 'Aucun cookie'}</pre>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">🔧 Tests API</h2>
            <button 
              onClick={async () => {
                try {
                  const response = await fetch('/api/auth/session');
                  const data = await response.json();
                  alert(`Réponse API session: ${JSON.stringify(data, null, 2)}`);
                } catch (error) {
                  alert(`Erreur API: ${error}`);
                }
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Tester /api/auth/session
            </button>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-100 rounded">
          <h3 className="font-semibold">📋 Instructions pour le client :</h3>
          <ol className="mt-2 list-decimal list-inside space-y-1 text-sm">
                         <li>Visitez cette page : <code>/debug</code></li>
             <li>Prenez une capture d&apos;écran de toutes les informations</li>
             <li>Envoyez la capture au développeur</li>
             <li>Testez le bouton &quot;Tester /api/auth/session&quot;</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 