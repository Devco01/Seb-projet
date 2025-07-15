'use client';

import { useState } from 'react';

export default function AideClientPage() {
  const [resultat, setResultat] = useState<string>('');
  const [chargement, setChargement] = useState(false);
  const [etapeActuelle, setEtapeActuelle] = useState(0);

  const etapes = [
    '🔍 Vérification de votre navigateur...',
    '🍪 Test des cookies...',
    '🌐 Test de connexion au serveur...',
    '🔐 Test des identifiants...',
    '✅ Diagnostic terminé !'
  ];

  const diagnosticComplet = async () => {
    setChargement(true);
    setResultat('');
    setEtapeActuelle(0);

    let rapport = '📋 RAPPORT DE DIAGNOSTIC :\n\n';

    // Étape 1: Informations navigateur
    setEtapeActuelle(1);
    const navigateur = {
      userAgent: navigator.userAgent,
      cookiesActives: navigator.cookieEnabled,
      javascript: true, // Si on arrive ici, JS fonctionne
      langue: navigator.language,
      plateforme: navigator.platform,
      connexion: navigator.onLine
    };

    rapport += `🌐 NAVIGATEUR :\n`;
    rapport += `• Cookies activés : ${navigateur.cookiesActives ? '✅ OUI' : '❌ NON'}\n`;
    rapport += `• JavaScript : ✅ Fonctionne\n`;
    rapport += `• Connexion : ${navigateur.connexion ? '✅ En ligne' : '❌ Hors ligne'}\n`;
    rapport += `• Navigateur : ${getBrowserName(navigateur.userAgent)}\n\n`;

    // Étape 2: Test cookies
    setEtapeActuelle(2);
    let cookieTest = '✅ OK';
    try {
      document.cookie = 'test=1';
      if (!document.cookie.includes('test=1')) {
        cookieTest = '❌ BLOQUÉS';
      }
    } catch {
      cookieTest = '❌ ERREUR';
    }

    rapport += `🍪 COOKIES :\n`;
    rapport += `• État : ${cookieTest}\n`;
    rapport += `• Cookies existants : ${document.cookie ? 'Présents' : 'Aucun'}\n\n`;

    // Étape 3: Test serveur
    setEtapeActuelle(3);
    let serveurOK = false;
    try {
      const response = await fetch('/api/auth/session');
      serveurOK = response.ok;
      rapport += `🌍 SERVEUR :\n`;
      rapport += `• Connexion : ${serveurOK ? '✅ OK' : '❌ ÉCHEC'}\n`;
      rapport += `• Code réponse : ${response.status}\n\n`;
    } catch (error) {
      rapport += `🌍 SERVEUR :\n`;
      rapport += `• Connexion : ❌ IMPOSSIBLE\n`;
      rapport += `• Erreur : ${error}\n\n`;
    }

    // Étape 4: Test identifiants
    setEtapeActuelle(4);
    let connexionOK = false;
    try {
      const csrfResponse = await fetch('/api/auth/csrf');
      const csrfData = await csrfResponse.json();
      
      const loginResponse = await fetch('/api/auth/signin/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: 'facturepro',
          password: 'Facturepro2025!',
          csrfToken: csrfData.csrfToken || '',
          redirect: 'false'
        })
      });

      connexionOK = loginResponse.ok;
      rapport += `🔐 AUTHENTIFICATION :\n`;
      rapport += `• Test connexion : ${connexionOK ? '✅ RÉUSSIE' : '❌ ÉCHEC'}\n`;
      rapport += `• Code réponse : ${loginResponse.status}\n\n`;

    } catch (error) {
      rapport += `🔐 AUTHENTIFICATION :\n`;
      rapport += `• Test connexion : ❌ ERREUR\n`;
      rapport += `• Erreur : ${error}\n\n`;
    }

    // Étape 5: Diagnostic final
    setEtapeActuelle(5);
    rapport += `🎯 DIAGNOSTIC FINAL :\n`;
    
    if (connexionOK) {
      rapport += `✅ TOUT FONCTIONNE !\n`;
      rapport += `➡️ Vous pouvez vous connecter :\n`;
      rapport += `   • Utilisateur : facturepro\n`;
      rapport += `   • Mot de passe : Facturepro2025!\n`;
      rapport += `   • Lien : ${window.location.origin}/auth/login\n\n`;
    } else {
      rapport += `❌ PROBLÈME DÉTECTÉ :\n\n`;
      
      if (!navigateur.cookiesActives) {
        rapport += `🚨 CAUSE PROBABLE : Cookies désactivés\n`;
        rapport += `💡 SOLUTION : Activez les cookies dans votre navigateur\n\n`;
      } else if (!serveurOK) {
        rapport += `🚨 CAUSE PROBABLE : Problème de connexion serveur\n`;
        rapport += `💡 SOLUTION : Réessayez dans quelques minutes\n\n`;
      } else {
        rapport += `🚨 CAUSE PROBABLE : Problème d'authentification\n`;
        rapport += `💡 SOLUTION : Contactez votre développeur\n\n`;
      }

      rapport += `📧 MESSAGE POUR VOTRE DÉVELOPPEUR :\n`;
      rapport += `"Problème de connexion détecté\n`;
      rapport += `Heure : ${new Date().toLocaleString('fr-FR')}\n`;
      rapport += `Navigateur : ${getBrowserName(navigateur.userAgent)}\n`;
      rapport += `Cookies : ${cookieTest}\n`;
      rapport += `Serveur : ${serveurOK ? 'OK' : 'ERREUR'}\n`;
      rapport += `Connexion : ${connexionOK ? 'OK' : 'ÉCHEC'}"\n\n`;
    }

    setResultat(rapport);
    setChargement(false);
  };

  const getBrowserName = (userAgent: string): string => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Internet Explorer') || userAgent.includes('MSIE')) return 'Internet Explorer (ancien)';
    return 'Autre navigateur';
  };

  const copierResultat = () => {
    navigator.clipboard.writeText(resultat);
    alert('Rapport copié ! Vous pouvez le coller dans un email.');
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8">
        
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            🔧 Diagnostic de connexion
          </h1>
          <p className="text-gray-600 text-lg">
            Test automatique pour identifier les problèmes de connexion
          </p>
        </div>

        {/* Bouton principal */}
        <div className="text-center mb-8">
          <button
            onClick={diagnosticComplet}
            disabled={chargement}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-12 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
          >
            {chargement ? '⏳ Diagnostic en cours...' : '🚀 FAIRE LE DIAGNOSTIC'}
          </button>
        </div>

        {/* Progression */}
        {chargement && (
          <div className="mb-8">
            <div className="bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(etapeActuelle / etapes.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-center text-gray-600">
              {etapes[etapeActuelle]} ({etapeActuelle}/{etapes.length})
            </p>
          </div>
        )}

        {/* Résultat */}
        {resultat && (
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">📋 Rapport de diagnostic :</h3>
              <button
                onClick={copierResultat}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm"
              >
                📋 Copier le rapport
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono bg-white p-4 rounded border max-h-96 overflow-y-auto">
              {resultat}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">📖 Comment utiliser :</h3>
          <ol className="text-gray-700 space-y-2">
            <li><strong>1.</strong> Cliquez sur &quot;FAIRE LE DIAGNOSTIC&quot;</li>
            <li><strong>2.</strong> Attendez que tous les tests se terminent</li>
            <li><strong>3.</strong> Lisez le résultat (✅ = OK, ❌ = problème)</li>
            <li><strong>4.</strong> Si problème : copiez le rapport et envoyez-le par email</li>
          </ol>
        </div>

        {/* Solutions courantes */}
        <div className="mt-6 bg-yellow-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-800 mb-3">🛠️ Solutions courantes :</h3>
          <ul className="text-gray-700 space-y-2 text-sm">
            <li><strong>Cookies bloqués :</strong> Activez les cookies dans les paramètres de votre navigateur</li>
            <li><strong>Cache corrompu :</strong> Videz le cache (Ctrl+F5 ou Ctrl+Maj+R)</li>
            <li><strong>Navigateur ancien :</strong> Mettez à jour votre navigateur</li>
            <li><strong>Antivirus :</strong> Ajoutez le site en exception</li>
          </ul>
        </div>

      </div>
    </div>
  );
} 