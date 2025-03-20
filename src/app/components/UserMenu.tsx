'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

export default function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        <span>{session.user?.name || session.user?.email}</span>
        <svg
          className={`h-5 w-5 transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg z-50">
          <Link
            href="/parametres"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Paramètres
          </Link>
          <button
            onClick={() => {
              signOut({ callbackUrl: '/auth/login' });
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
} 