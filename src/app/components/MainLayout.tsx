'use client';

import { useState, useEffect, ReactNode } from 'react';
import Sidebar from './Sidebar';
import UserMenu from './UserMenu';
import { FaBars } from 'react-icons/fa';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  
  // Récupérer le chemin actuel pour le debuggage
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  console.log("MainLayout rendu, chemin:", currentPath);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar pour mobile - s'ouvre avec un bouton */}
      <div 
        className={`md:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* Sidebar fixe pour desktop, absolute pour mobile */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>
      
      {/* Contenu principal avec flexbox pour permettre au contenu de scroller indépendamment */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header avec bouton pour ouvrir le sidebar sur mobile */}
        <header className="bg-white shadow-sm h-16 flex items-center px-4 md:px-6 sticky top-0 z-30">
          <button 
            className="md:hidden text-gray-600 hover:text-gray-800 mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars size={24} />
          </button>
          <div className="ml-auto flex space-x-4">
            {/* Menu utilisateur */}
            <UserMenu />
          </div>
        </header>
        
        {/* Contenu de la page avec scroll indépendant */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
        
        {/* Footer simple */}
        <footer className="bg-white py-4 px-6 border-t text-center text-gray-500 text-sm">
          FacturePro © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
} 