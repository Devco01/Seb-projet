"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FaHome, FaFileInvoiceDollar, FaFileAlt, FaUsers, FaMoneyBillWave, FaChartBar, FaCog, FaQuestionCircle } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: 'Tableau de bord', href: '/dashboard', icon: <FaHome className="w-5 h-5" /> },
    { name: 'Devis', href: '/devis', icon: <FaFileAlt className="w-5 h-5" /> },
    { name: 'Factures', href: '/factures', icon: <FaFileInvoiceDollar className="w-5 h-5" /> },
    { name: 'Clients', href: '/clients', icon: <FaUsers className="w-5 h-5" /> },
    { name: 'Paiements', href: '/paiements', icon: <FaMoneyBillWave className="w-5 h-5" /> },
    { name: 'Rapports', href: '/rapports', icon: <FaChartBar className="w-5 h-5" /> },
    { name: 'Paramètres', href: '/parametres', icon: <FaCog className="w-5 h-5" /> },
    { name: 'Support', href: '/support', icon: <FaQuestionCircle className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold">FacturePro</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
            >
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 flex items-center"
            >
              {item.icon}
              <span className="ml-2">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 