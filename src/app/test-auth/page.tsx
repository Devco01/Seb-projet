'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

interface TestResult {
  timestamp: string;
  test: string;
  status: 'success' | 'error' | 'info';
  message: string;
  data?: unknown;
}

export default function TestAuthPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test: string, status: 'success' | 'error' | 'info', message: string, data?: unknown) => {
    const result = {
      timestamp: new Date().toLocaleTimeString(),
      test,
      status,
      message,
      data
    };
    setTestResults(prev => [...prev, result]);
  };

  const runEnvironmentTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Informations environnement
    addResult('Environment', 'info', 'Collecte des informations environnement', {
      userAgent: navigator.userAgent,
      url: window.location.href,
      cookies: document.cookie,
      localStorage: localStorage.length,
      sessionStorage: sessionStorage.length
    });

    // Test 2: Test de l'API de session
    try {
      const sessionResponse = await fetch('/api/auth/session');
      const sessionData = await sessionResponse.json();
      addResult('Session API', sessionResponse.ok ? 'success' : 'error', 
        `Status: ${sessionResponse.status}`, sessionData);
    } catch (error) {
      addResult('Session API', 'error', `Erreur: ${error}`);
    }

    // Test 3: Test de l'API de diagnostic
    try {
      const diagResponse = await fetch('/api/debug');
      const diagData = await diagResponse.json();
      addResult('Diagnostic API', diagResponse.ok ? 'success' : 'error', 
        `Configuration: ${diagData.status}`, diagData);
    } catch (error) {
      addResult('Diagnostic API', 'error', `Erreur: ${error}`);
    }

    // Test 4: Test de l'API CSRF
    try {
      const csrfResponse = await fetch('/api/auth/csrf');
      const csrfData = await csrfResponse.json();
      addResult('CSRF Token', csrfResponse.ok ? 'success' : 'error', 
        'Token CSRF récupéré', csrfData);
    } catch (error) {
      addResult('CSRF Token', 'error', `Erreur: ${error}`);
    }

    setIsRunning(false);
  };

  const testAuthentication = async (username: string, password: string) => {
    setIsRunning(true);
    addResult('Auth Test', 'info', `Test de connexion avec: ${username}`);

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        addResult('Auth Test', 'error', `Échec: ${result.error}`, result);
      } else if (result?.ok) {
        addResult('Auth Test', 'success', 'Connexion réussie!', result);
        
        // Vérifier la session après connexion
        setTimeout(async () => {
          try {
            const sessionCheck = await fetch('/api/auth/session');
            const sessionData = await sessionCheck.json();
            addResult('Post-Auth Session', 'info', 'Session après connexion', sessionData);
          } catch (error) {
            addResult('Post-Auth Session', 'error', `Erreur vérification session: ${error}`);
          }
        }, 1000);
      }
    } catch (error) {
      addResult('Auth Test', 'error', `Erreur de connexion: ${error}`);
    }

    setIsRunning(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">🧪 Tests d&apos;authentification</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Panneau de contrôle */}
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">🔍 Tests d&apos;environnement</h2>
                <button
                  onClick={runEnvironmentTests}
                  disabled={isRunning}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isRunning ? 'Test en cours...' : 'Lancer les tests d\'environnement'}
                </button>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">🔑 Tests d&apos;authentification</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => testAuthentication('facturepro', 'FacturePro@2023!')}
                    disabled={isRunning}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    ✅ Test avec identifiants corrects
                  </button>
                  
                  <button
                    onClick={() => testAuthentication('facturepro', 'mauvais-password')}
                    disabled={isRunning}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 disabled:opacity-50"
                  >
                    ❌ Test avec mot de passe incorrect
                  </button>
                  
                  <button
                    onClick={() => testAuthentication('mauvais-user', 'FacturePro@2023!')}
                    disabled={isRunning}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    ❌ Test avec utilisateur incorrect
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <button
                  onClick={clearResults}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                >
                  🗑️ Effacer les résultats
                </button>
              </div>
            </div>

            {/* Résultats */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">📊 Résultats des tests</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <p className="text-gray-500 italic">Aucun test lancé</p>
                ) : (
                  testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded border-l-4 ${
                        result.status === 'success' ? 'bg-green-100 border-green-500' :
                        result.status === 'error' ? 'bg-red-100 border-red-500' :
                        'bg-blue-100 border-blue-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">{result.test}</span>
                        <span className="text-xs text-gray-500">{result.timestamp}</span>
                      </div>
                      <p className="text-sm">{result.message}</p>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer text-gray-600">Voir les détails</summary>
                          <pre className="text-xs bg-white p-2 mt-1 rounded overflow-x-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-100 rounded-lg">
            <h3 className="font-semibold mb-2">📋 Instructions pour tester :</h3>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Partagez cette URL avec votre client : <code>/test-auth</code></li>
              <li>Demandez-lui de lancer les &quot;Tests d&apos;environnement&quot;</li>
              <li>Puis les &quot;Tests d&apos;authentification&quot;</li>
              <li>Il peut copier-coller les résultats pour vous les envoyer</li>
              <li>Vous pourrez identifier précisément le problème</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 