'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';

export default function ResetPage() {
  const [message, setMessage] = useState('Nettoyage des cookies et de la session...');

  useEffect(() => {
    // Fonction pour effacer tous les cookies
    const clearAllCookies = () => {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      }
    };

    // Déconnexion de NextAuth
    const resetAuth = async () => {
      try {
        await signOut({ redirect: false });
        clearAllCookies();
        setMessage('Nettoyage terminé. Redirection dans 3 secondes...');
        
        // Redirection vers la page d'accueil avec un délai
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } catch (error) {
        console.error('Erreur lors de la réinitialisation:', error);
        setMessage('Erreur lors du nettoyage. Veuillez rafraîchir manuellement.');
      }
    };

    resetAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-2xl font-bold">Réinitialisation de la session</h1>
        <div className="animate-pulse">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
} 