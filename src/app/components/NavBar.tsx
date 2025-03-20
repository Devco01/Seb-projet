'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { ResponsiveContainer } from './Layout/ResponsiveContainer';

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <ResponsiveContainer>
        <div className="flex justify-between items-center h-16">
          {/* Logo et titre */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">FacturePro</span>
            </Link>
          </div>

          {/* Navigation sur Desktop */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/dashboard" className="px-3 py-2 text-gray-700 hover:text-blue-600">
              Tableau de bord
            </Link>
            <Link href="/clients" className="px-3 py-2 text-gray-700 hover:text-blue-600">
              Clients
            </Link>
            <Link href="/devis" className="px-3 py-2 text-gray-700 hover:text-blue-600">
              Devis
            </Link>
            <Link href="/factures" className="px-3 py-2 text-gray-700 hover:text-blue-600">
              Factures
            </Link>
            <Link href="/paiements" className="px-3 py-2 text-gray-700 hover:text-blue-600">
              Paiements
            </Link>
          </nav>

          {/* Boutons à droite */}
          <div className="flex items-center">
            {/* Menu utilisateur */}
            <div className="relative ml-3">
              <button
                type="button"
                className="flex items-center p-2 rounded-full text-gray-700 hover:text-blue-600 focus:outline-none"
                onClick={toggleUserMenu}
              >
                <span className="sr-only">Ouvrir le menu utilisateur</span>
                <FaUser className="h-5 w-5" />
              </button>

              {/* Dropdown menu utilisateur */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                  <Link
                    href="/parametres"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FaCog className="inline mr-2" /> Paramètres
                  </Link>
                  <Link
                    href="/logout"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FaSignOutAlt className="inline mr-2" /> Déconnexion
                  </Link>
                </div>
              )}
            </div>

            {/* Bouton Menu Mobile */}
            <button
              type="button"
              className="md:hidden ml-2 p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
              onClick={toggleMenu}
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </ResponsiveContainer>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              Tableau de bord
            </Link>
            <Link
              href="/clients"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              Clients
            </Link>
            <Link
              href="/devis"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              Devis
            </Link>
            <Link
              href="/factures"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              Factures
            </Link>
            <Link
              href="/paiements"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              Paiements
            </Link>
          </div>
        </div>
      )}
    </header>
  );
} 