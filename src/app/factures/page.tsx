"use client";

import Layout from '../components/Layout';
import Link from 'next/link';
import { FaPlus, FaSearch, FaFileInvoiceDollar, FaEye, FaEdit, FaTrash, FaMoneyBillWave, FaFilePdf } from 'react-icons/fa';
import { useState } from 'react';

export default function Factures() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Données fictives pour les factures
  const factures = [
    { id: 1, number: 'F-2023-042', client: 'Dupont SAS', date: '15/03/2023', amount: '1 250 €', status: 'Payée', dueDate: '15/04/2023' },
    { id: 2, number: 'F-2023-041', client: 'Résidences du Parc', date: '08/03/2023', amount: '950 €', status: 'Impayée', dueDate: '08/04/2023' },
    { id: 3, number: 'F-2023-040', client: 'Martin Immobilier', date: '01/03/2023', amount: '2 780 €', status: 'Payée', dueDate: '01/04/2023' },
    { id: 4, number: 'F-2023-039', client: 'Leroy Construction', date: '25/02/2023', amount: '4 200 €', status: 'Impayée', dueDate: '25/03/2023' },
    { id: 5, number: 'F-2023-038', client: 'Dubois et Fils', date: '18/02/2023', amount: '1 850 €', status: 'Payée', dueDate: '18/03/2023' },
  ];

  // Filtrer les factures en fonction du terme de recherche
  const filteredFactures = factures.filter(
    (facture) =>
      facture.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facture.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facture.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Gestion des factures</h1>
          <Link
            href="/factures/nouveau"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            <FaPlus className="mr-2" /> Nouvelle facture
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Rechercher une facture..."
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <select
                id="status"
                name="status"
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="">Tous les statuts</option>
                <option value="payee">Payée</option>
                <option value="impayee">Impayée</option>
                <option value="retard">En retard</option>
              </select>
              <select
                id="sort"
                name="sort"
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="date-desc">Date (récent d'abord)</option>
                <option value="date-asc">Date (ancien d'abord)</option>
                <option value="amount-desc">Montant (élevé d'abord)</option>
                <option value="amount-asc">Montant (faible d'abord)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des factures */}
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
                    Échéance
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
                {filteredFactures.map((facture) => (
                  <tr key={facture.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      <Link href={`/factures/${facture.id}`} className="hover:underline">
                        {facture.number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {facture.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {facture.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {facture.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {facture.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${facture.status === 'Payée' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {facture.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/factures/${facture.id}`} className="text-blue-600 hover:text-blue-900" title="Voir">
                          <FaEye />
                        </Link>
                        <Link href={`/factures/${facture.id}/modifier`} className="text-indigo-600 hover:text-indigo-900" title="Modifier">
                          <FaEdit />
                        </Link>
                        <Link href={`/factures/${facture.id}/pdf`} className="text-orange-600 hover:text-orange-900" title="Télécharger PDF">
                          <FaFilePdf />
                        </Link>
                        {facture.status !== 'Payée' && (
                          <Link href={`/paiements/nouveau?facture=${facture.id}`} className="text-yellow-600 hover:text-yellow-900" title="Enregistrer un paiement">
                            <FaMoneyBillWave />
                          </Link>
                        )}
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
          {filteredFactures.length === 0 && (
            <div className="px-6 py-4 text-center text-gray-500">
              Aucune facture trouvée.
            </div>
          )}
        </div>

        {/* Note sur la TVA */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Toutes les factures incluent automatiquement la mention "TVA non applicable, art. 293 B du CGI" conformément au statut d'auto-entrepreneur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 