"use client";

import Layout from '../components/Layout';
import Link from 'next/link';
import { FaPlus, FaSearch, FaMoneyBillWave, FaEye, FaEdit, FaTrash, FaFileInvoiceDollar } from 'react-icons/fa';
import { useState } from 'react';

export default function Paiements() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Données fictives pour les paiements
  const paiements = [
    { 
      id: 1, 
      date: '15/03/2023', 
      facture: 'F-2023-042', 
      client: 'Dupont SAS', 
      amount: '1 250 €', 
      method: 'Virement bancaire',
      reference: 'VIR-2023-0315-DUP'
    },
    { 
      id: 2, 
      date: '01/03/2023', 
      facture: 'F-2023-040', 
      client: 'Martin Immobilier', 
      amount: '2 780 €', 
      method: 'Chèque',
      reference: 'CHQ-2023-0301-MAR'
    },
    { 
      id: 3, 
      date: '18/02/2023', 
      facture: 'F-2023-038', 
      client: 'Dubois et Fils', 
      amount: '1 850 €', 
      method: 'Virement bancaire',
      reference: 'VIR-2023-0218-DUB'
    },
    { 
      id: 4, 
      date: '05/02/2023', 
      facture: 'F-2023-037', 
      client: 'Résidences du Parc', 
      amount: '3 450 €', 
      method: 'Virement bancaire',
      reference: 'VIR-2023-0205-RES'
    },
    { 
      id: 5, 
      date: '28/01/2023', 
      facture: 'F-2023-035', 
      client: 'Leroy Construction', 
      amount: '4 200 €', 
      method: 'Chèque',
      reference: 'CHQ-2023-0128-LER'
    },
  ];

  // Filtrer les paiements en fonction du terme de recherche
  const filteredPaiements = paiements.filter(
    (paiement) =>
      paiement.facture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paiement.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paiement.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paiement.method.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Suivi des paiements</h1>
          <Link
            href="/paiements/nouveau"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700"
          >
            <FaPlus className="mr-2" /> Nouveau paiement
          </Link>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/3">
              <label htmlFor="search" className="sr-only">
                Rechercher
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  placeholder="Rechercher un paiement..."
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <select
                id="method"
                name="method"
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              >
                <option value="">Tous les modes de paiement</option>
                <option value="virement">Virement bancaire</option>
                <option value="cheque">Chèque</option>
                <option value="especes">Espèces</option>
                <option value="carte">Carte bancaire</option>
              </select>
              <select
                id="sort"
                name="sort"
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              >
                <option value="date-desc">Date (récent d'abord)</option>
                <option value="date-asc">Date (ancien d'abord)</option>
                <option value="amount-desc">Montant (élevé d'abord)</option>
                <option value="amount-asc">Montant (faible d'abord)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des paiements */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facture
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mode de paiement
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Référence
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPaiements.map((paiement) => (
                  <tr key={paiement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {paiement.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      <Link href={`/factures/${paiement.facture}`} className="hover:underline">
                        {paiement.facture}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {paiement.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {paiement.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {paiement.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {paiement.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/paiements/${paiement.id}`} className="text-blue-600 hover:text-blue-900" title="Voir">
                          <FaEye />
                        </Link>
                        <Link href={`/paiements/${paiement.id}/modifier`} className="text-indigo-600 hover:text-indigo-900" title="Modifier">
                          <FaEdit />
                        </Link>
                        <Link href={`/factures/${paiement.facture}`} className="text-green-600 hover:text-green-900" title="Voir la facture">
                          <FaFileInvoiceDollar />
                        </Link>
                        <button className="text-red-600 hover:text-red-900" title="Supprimer">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredPaiements.length === 0 && (
            <div className="px-6 py-4 text-center text-gray-500">
              Aucun paiement trouvé.
            </div>
          )}
        </div>

        {/* Rappels de paiement */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Rappels de paiement</h2>
            <Link href="/parametres/rappels" className="text-sm text-yellow-600 hover:text-yellow-800">
              Configurer les rappels
            </Link>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <p className="text-sm text-gray-500 mb-4">
              Configurez des rappels automatiques pour les factures impayées. Les rappels seront envoyés par email aux clients selon le calendrier que vous définissez.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-900">Premier rappel</h3>
                <p className="mt-1 text-sm text-gray-500">3 jours après la date d'échéance</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Actif
                  </span>
                </div>
              </div>
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-900">Deuxième rappel</h3>
                <p className="mt-1 text-sm text-gray-500">10 jours après la date d'échéance</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Actif
                  </span>
                </div>
              </div>
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-900">Rappel final</h3>
                <p className="mt-1 text-sm text-gray-500">30 jours après la date d'échéance</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Inactif
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 