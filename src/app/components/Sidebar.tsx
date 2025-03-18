'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FaHome,
  FaUsers,
  FaFileInvoiceDollar,
  FaFileContract,
  FaMoneyBillWave,
  FaCog,
} from 'react-icons/fa';

interface SidebarProps {
  closeSidebar?: () => void;
}

export default function Sidebar({ closeSidebar }: SidebarProps) {
  const [pathname, setPathname] = useState('');
  
  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  // Fonction pour déterminer si un lien est actif
  const isActive = (path: string) => {
    return pathname?.startsWith(path) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';
  };

  const handleLinkClick = () => {
    if (closeSidebar) {
      closeSidebar();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-r">
      <div className="p-5 border-b">
        <h1 className="text-2xl font-bold text-blue-600">FacturePro</h1>
        <p className="text-sm text-gray-500">Gestion de facturation</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          <li>
            <Link 
              href="/dashboard/" 
              className={`flex items-center px-4 py-3 text-base rounded-md ${isActive('/dashboard')}`}
              onClick={handleLinkClick}
            >
              <FaHome className="mr-3" />
              Tableau de bord
            </Link>
          </li>
          <li>
            <Link 
              href="/clients/" 
              className={`flex items-center px-4 py-3 text-base rounded-md ${isActive('/clients')}`}
              onClick={handleLinkClick}
            >
              <FaUsers className="mr-3" />
              Clients
            </Link>
          </li>
          <li>
            <Link 
              href="/devis/" 
              className={`flex items-center px-4 py-3 text-base rounded-md ${isActive('/devis')}`}
              onClick={handleLinkClick}
            >
              <FaFileContract className="mr-3" />
              Devis
            </Link>
          </li>
          <li>
            <Link 
              href="/factures/" 
              className={`flex items-center px-4 py-3 text-base rounded-md ${isActive('/factures')}`}
              onClick={handleLinkClick}
            >
              <FaFileInvoiceDollar className="mr-3" />
              Factures
            </Link>
          </li>
          <li>
            <Link 
              href="/paiements/" 
              className={`flex items-center px-4 py-3 text-base rounded-md ${isActive('/paiements')}`}
              onClick={handleLinkClick}
            >
              <FaMoneyBillWave className="mr-3" />
              Paiements
            </Link>
          </li>
        </ul>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <ul className="space-y-1 px-3">
            <li>
              <Link 
                href="/parametres/" 
                className={`flex items-center px-4 py-3 text-base rounded-md ${isActive('/parametres')}`}
                onClick={handleLinkClick}
              >
                <FaCog className="mr-3" />
                Paramètres
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
} 