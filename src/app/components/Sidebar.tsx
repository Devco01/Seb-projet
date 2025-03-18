'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaHome, 
  FaFileInvoiceDollar, 
  FaFileContract, 
  FaUsers, 
  FaCreditCard, 
  FaCog
} from 'react-icons/fa';

// Éléments de navigation simplifiés
const navItems = [
  { name: 'Tableau de bord', href: '/dashboard', icon: FaHome },
  { name: 'Devis', href: '/devis', icon: FaFileContract },
  { name: 'Factures', href: '/factures', icon: FaFileInvoiceDollar },
  { name: 'Clients', href: '/clients', icon: FaUsers },
  { name: 'Paiements', href: '/paiements', icon: FaCreditCard },
  { name: 'Paramètres', href: '/parametres', icon: FaCog },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-gray-100 text-gray-700 p-4 overflow-y-auto border-r border-gray-200 shadow-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-600">FacturePro</h1>
        <p className="text-sm text-gray-500">Peinture en bâtiment</p>
      </div>
      
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`flex items-center p-3 md:p-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-100 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <item.icon className={`mr-3 text-xl md:text-base ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="text-base">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
} 