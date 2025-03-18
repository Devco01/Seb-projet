'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { FaBars } from 'react-icons/fa';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détection du mode mobile au chargement et redimensionnement
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Vérifier au chargement
    checkIsMobile();
    
    // Ajouter un écouteur d'événement pour le redimensionnement
    window.addEventListener('resize', checkIsMobile);
    
    // Nettoyer l'écouteur à la démonter du composant
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Bouton d'affichage/masquage sur mobile */}
      <button 
        className="md:hidden fixed top-4 left-4 z-30 bg-blue-600 text-white p-2 rounded-md shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FaBars />
      </button>
      
      {/* Sidebar avec état responsive */}
      <div className={`${isMobile ? 'fixed z-20' : ''} ${isMobile && !sidebarOpen ? '-translate-x-full' : ''} transition-transform duration-300 ease-in-out`}>
        <Sidebar />
      </div>
      
      {/* Overlay pour fermer le menu sur mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Contenu principal avec marge adaptative */}
      <main className={`flex-1 ${!isMobile ? 'ml-64' : 'ml-0'} p-5 bg-gray-50 transition-all duration-300 ease-in-out`}>
        <div className="max-w-6xl mx-auto">
          {/* Ajouter de l'espace en haut sur mobile pour le bouton */}
          {isMobile && <div className="h-12" />}
          {children}
        </div>
        <footer className="mt-10 pt-4 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} FacturePro - Peinture en bâtiment
          </p>
        </footer>
      </main>
    </div>
  );
} 