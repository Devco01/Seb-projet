"use client";

import Layout from '../components/Layout';
import Link from 'next/link';
import { FaPlus, FaSearch, FaFileAlt, FaEye, FaEdit, FaTrash, FaFileInvoiceDollar } from 'react-icons/fa';
import { useState } from 'react';

export default function Devis() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Données fictives pour les devis
  const devis = [
    { id: 1, number: 'D-2023-056', client: 'Martin Immobilier', date: '12/03/2023', amount: '2 780 €', status: 'En attente' },
    { id: 2, number: 'D-2023-055', client: 'Dubois et Fils', date: '05/03/2023', amount: '1 850 €', status: 'Accepté' },
    { id: 3, number: 'D-2023-054', client: 'Résidences du Parc', date: '28/02/2023', amount: '3 450 €', status: 'Refusé' },
    { id: 4, number: 'D-2023-053', client: 'Dupont SAS', date: '15/02/2023', amount: '1 250 €', status: 'Accepté' },
    { id: 5, number: 'D-2023-052', client: 'Leroy Construction', date: '10/02/2023', amount: '4 200 €', status: 'En attente' },
  ];

  // Filtrer les devis en fonction du terme de recherche
  const filteredDevis = devis.filter(
    (devis) =>
      devis.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devis.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devis.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Gestion des devis</h1>
          <Link
            href="/devis/nouveau"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <FaPlus className="mr-2" /> Nouveau devis
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Rechercher un devis..."
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <select
                id="status"
                name="status"
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Tous les statuts</option>
                <option value="en-attente">En attente</option>
                <option value="accepte">Accepté</option>
                <option value="refuse">Refusé</option>
              </select>
              <select
                id="sort"
                name="sort"
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="date-desc">Date (récent d'abord)</option>
                <option value="date-asc">Date (ancien d'abord)</option>
                <option value="amount-desc">Montant (élevé d'abord)</option>
                <option value="amount-asc">Montant (faible d'abord)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des devis */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numéro
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDevis.map((devis) => (
                  <tr key={devis.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link href={`/devis/${devis.id}`} className="hover:underline">
                        {devis.number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {devis.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {devis.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {devis.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${devis.status === 'Accepté' ? 'bg-green-100 text-green-800' : 
                          devis.status === 'Refusé' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {devis.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/devis/${devis.id}`} className="text-blue-600 hover:text-blue-900" title="Voir">
                          <FaEye />
                        </Link>
                        <Link href={`/devis/${devis.id}/modifier`} className="text-indigo-600 hover:text-indigo-900" title="Modifier">
                          <FaEdit />
                        </Link>
                        <Link href={`/factures/nouveau?devis=${devis.id}`} className="text-green-600 hover:text-green-900" title="Convertir en facture">
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
          {filteredDevis.length === 0 && (
            <div className="px-6 py-4 text-center text-gray-500">
              Aucun devis trouvé.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 