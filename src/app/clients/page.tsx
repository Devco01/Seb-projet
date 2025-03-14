"use client";

import Layout from '../components/Layout';
import Link from 'next/link';
import { FaPlus, FaSearch, FaUsers, FaEye, FaEdit, FaTrash, FaFileInvoiceDollar, FaFileAlt } from 'react-icons/fa';
import { useState } from 'react';

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Données fictives pour les clients
  const clients = [
    { 
      id: 1, 
      name: 'Dupont SAS', 
      contact: 'Jean Dupont', 
      email: 'contact@dupont-sas.fr', 
      phone: '01 23 45 67 89', 
      address: '15 rue des Lilas, 75001 Paris',
      devisCount: 3,
      facturesCount: 5,
      totalAmount: '8 750 €'
    },
    { 
      id: 2, 
      name: 'Résidences du Parc', 
      contact: 'Marie Martin', 
      email: 'contact@residences-parc.fr', 
      phone: '01 34 56 78 90', 
      address: '8 avenue du Parc, 69002 Lyon',
      devisCount: 2,
      facturesCount: 3,
      totalAmount: '5 200 €'
    },
    { 
      id: 3, 
      name: 'Martin Immobilier', 
      contact: 'Pierre Martin', 
      email: 'p.martin@martin-immo.fr', 
      phone: '01 45 67 89 01', 
      address: '25 boulevard Haussmann, 75008 Paris',
      devisCount: 4,
      facturesCount: 2,
      totalAmount: '4 630 €'
    },
    { 
      id: 4, 
      name: 'Leroy Construction', 
      contact: 'Sophie Leroy', 
      email: 'contact@leroy-construction.fr', 
      phone: '01 56 78 90 12', 
      address: '42 rue de la République, 13001 Marseille',
      devisCount: 1,
      facturesCount: 4,
      totalAmount: '12 350 €'
    },
    { 
      id: 5, 
      name: 'Dubois et Fils', 
      contact: 'François Dubois', 
      email: 'f.dubois@dubois-fils.fr', 
      phone: '01 67 89 01 23', 
      address: '3 place Bellecour, 69002 Lyon',
      devisCount: 2,
      facturesCount: 3,
      totalAmount: '6 800 €'
    },
  ];

  // Filtrer les clients en fonction du terme de recherche
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Gestion des clients</h1>
          <Link
            href="/clients/nouveau"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
          >
            <FaPlus className="mr-2" /> Nouveau client
          </Link>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/2">
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Rechercher un client par nom, contact, email ou adresse..."
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <select
                id="sort"
                name="sort"
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              >
                <option value="name">Trier par nom</option>
                <option value="amount-desc">Trier par montant total (élevé d'abord)</option>
                <option value="amount-asc">Trier par montant total (faible d'abord)</option>
                <option value="factures-desc">Trier par nombre de factures</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des clients */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adresse
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Devis
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Factures
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-purple-600">
                        <Link href={`/clients/${client.id}`} className="hover:underline">
                          {client.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.contact}</div>
                      <div className="text-sm text-gray-500">{client.email}</div>
                      <div className="text-sm text-gray-500">{client.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.devisCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.facturesCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {client.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/clients/${client.id}`} className="text-blue-600 hover:text-blue-900" title="Voir">
                          <FaEye />
                        </Link>
                        <Link href={`/clients/${client.id}/modifier`} className="text-indigo-600 hover:text-indigo-900" title="Modifier">
                          <FaEdit />
                        </Link>
                        <Link href={`/devis/nouveau?client=${client.id}`} className="text-blue-600 hover:text-blue-900" title="Créer un devis">
                          <FaFileAlt />
                        </Link>
                        <Link href={`/factures/nouveau?client=${client.id}`} className="text-green-600 hover:text-green-900" title="Créer une facture">
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
          {filteredClients.length === 0 && (
            <div className="px-6 py-4 text-center text-gray-500">
              Aucun client trouvé.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 