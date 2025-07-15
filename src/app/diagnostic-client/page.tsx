'use client';

import { useState, useEffect } from 'react';

interface DiagnosticInfo {
  url: string;
  userAgent: string;
  navigatorInfo: {
    cookieEnabled: boolean;
    language: string;
    onLine: boolean;
    platform: string;
  };
  cookies: string;
  localStorage: {
    available: boolean;
    itemCount: number;
  };
}

export default function DiagnosticClientPage() {
  const [infos, setInfos] = useState<DiagnosticInfo | null>(null);
  const [loginTest, setLoginTest] = useState<string>('');

  useEffect(() => {
    setInfos({
      url: window.location.href,
      userAgent: navigator.userAgent,
      navigatorInfo: {
        cookieEnabled: navigator.cookieEnabled,
        language: navigator.language,
        onLine: navigator.onLine,
        platform: navigator.platform
      },
      cookies: document.cookie,
      localStorage: {
        available: typeof Storage !== 'undefined',
        itemCount: localStorage ? localStorage.length : 0
      }
    });
  }, []);

  const testLogin = async () => {
    setLoginTest('Test en cours...');
    
    try {
      // Test 1: Vérifier si NextAuth fonctionne
      const sessionTest = await fetch('/api/auth/session');
      if (!sessionTest.ok) {
        setLoginTest(`❌ ERREUR: API session inaccessible (${sessionTest.status})`);
        return;
      }

      // Test 2: Tenter une connexion
      const response = await fetch('/api/auth/signin/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: 'facturepro',
          password: 'Facturepro2025!',
          csrfToken: await getCsrfToken()
        })
      });

      if (response.ok) {
        setLoginTest('✅ SUCCÈS: Les identifiants fonctionnent !');
      } else {
        setLoginTest(`❌ ÉCHEC: Code ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      setLoginTest(`❌ ERREUR RÉSEAU: ${error}`);
    }
  };

  const getCsrfToken = async () => {
    try {
      const response = await fetch('/api/auth/csrf');
      const data = await response.json();
      return data.csrfToken || '';
    } catch {
      return '';
    }
  };

  if (!infos) {
    return <div className="p-8">Chargement du diagnostic...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          🔍 Diagnostic pour le client
        </h1>

        <div className="mb-8 p-4 bg-yellow-100 rounded-lg">
          <h2 className="font-bold text-lg mb-2">📋 Instructions :</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
                         <li><strong>Cliquez sur &quot;Tester la connexion&quot;</strong> ci-dessous</li>
             <li><strong>Copiez TOUT le contenu</strong> de cette page</li>
             <li><strong>Envoyez le texte complet</strong> au développeur</li>
             <li><strong>N&apos;oubliez pas le résultat du test de connexion !</strong></li>
          </ol>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">🌐 Informations navigateur</h2>
            <div className="space-y-2 text-sm">
              <p><strong>URL :</strong> {infos.url}</p>
              <p><strong>Navigateur :</strong> {infos.userAgent}</p>
              <p><strong>Cookies activés :</strong> {infos.navigatorInfo.cookieEnabled ? '✅ Oui' : '❌ Non'}</p>
              <p><strong>Langue :</strong> {infos.navigatorInfo.language}</p>
              <p><strong>Plateforme :</strong> {infos.navigatorInfo.platform}</p>
              <p><strong>En ligne :</strong> {infos.navigatorInfo.onLine ? '✅ Oui' : '❌ Non'}</p>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">🍪 État du stockage</h2>
            <div className="space-y-2 text-sm">
              <p><strong>LocalStorage :</strong> {infos.localStorage.available ? '✅ Disponible' : '❌ Indisponible'}</p>
              <p><strong>Éléments stockés :</strong> {infos.localStorage.itemCount}</p>
              <p><strong>Cookies présents :</strong></p>
              <div className="bg-white p-2 rounded mt-2 max-h-20 overflow-y-auto">
                {infos.cookies || '(aucun cookie)'}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-red-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🔐 Test de connexion</h2>
          <button
            onClick={testLogin}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            disabled={loginTest.includes('Test en cours')}
          >
            🧪 Tester la connexion
          </button>
          <div className="mt-4 p-4 bg-white rounded">
            <strong>Résultat :</strong> {loginTest || 'Pas encore testé'}
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">📧 À envoyer au développeur :</h2>
          <textarea
            readOnly
            value={`DIAGNOSTIC CLIENT:
URL: ${infos.url}
Navigateur: ${infos.userAgent}
Cookies activés: ${infos.navigatorInfo.cookieEnabled}
LocalStorage: ${infos.localStorage.available}
Cookies: ${infos.cookies}
Test de connexion: ${loginTest}
Timestamp: ${new Date().toISOString()}`}
            className="w-full h-32 p-2 text-xs border rounded"
          />
          <button
            onClick={() => navigator.clipboard?.writeText(`DIAGNOSTIC CLIENT:
URL: ${infos.url}
Navigateur: ${infos.userAgent}
Cookies activés: ${infos.navigatorInfo.cookieEnabled}
LocalStorage: ${infos.localStorage.available}
Cookies: ${infos.cookies}
Test de connexion: ${loginTest}
Timestamp: ${new Date().toISOString()}`)}
            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
          >
            📋 Copier dans le presse-papiers
          </button>
        </div>
      </div>
    </div>
  );
} 