"use client";

import { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaInfoCircle, FaFileInvoiceDollar, FaFileContract } from 'react-icons/fa';
import Link from 'next/link';

// Données fictives pour les clients
const clientsData = [
  { 
    id: 1, 
    nom: 'Dupont SAS', 
    contact: 'Jean Dupont', 
    email: 'contact@dupont-sas.fr', 
    telephone: '01 23 45 67 89', 
    adresse: '15 rue des Lilas, 75001 Paris', 
    dateCreation: '12/01/2023',
    facturesTotal: 5,
    montantTotal: '8 500 €'
  },
  { 
    id: 2, 
    nom: 'Martin Construction', 
    contact: 'Sophie Martin', 
    email: 'sophie@martin-construction.fr', 
    telephone: '01 98 76 54 32', 
    adresse: '8 avenue Victor Hugo, 69002 Lyon', 
    dateCreation: '25/02/2023',
    facturesTotal: 3,
    montantTotal: '4 200 €'
  },
  { 
    id: 3, 
    nom: 'Dubois SARL', 
    contact: 'Pierre Dubois', 
    email: 'p.dubois@dubois-sarl.com', 
    telephone: '03 45 67 89 01', 
    adresse: '22 boulevard Gambetta, 33000 Bordeaux', 
    dateCreation: '18/03/2023',
    facturesTotal: 2,
    montantTotal: '3 150 €'
  },
  { 
    id: 4, 
    nom: 'Résidences du Parc', 
    contact: 'Marie Leroy', 
    email: 'contact@residences-parc.fr', 
    telephone: '04 56 78 90 12', 
    adresse: '5 rue du Parc, 44000 Nantes', 
    dateCreation: '02/04/2023',
    facturesTotal: 1,
    montantTotal: '1 850 €'
  },
];

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState(clientsData);
  const [showGuide, setShowGuide] = useState(true);

  // Filtrer les clients en fonction du terme de recherche
  const filteredClients = clients.filter(client => 
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour supprimer un client
  const handleDeleteClient = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      setClients(clients.filter(client => client.id !== id));
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-gray-600">Gérez vos clients et leurs informations</p>
        </div>
        <Link 
          href="/clients/nouveau" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Nouveau client
        </Link>
      </div>

      {showGuide && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
          <div className="flex items-start">
            <FaInfoCircle className="text-blue-500 mt-1 mr-3" />
            <div>
              <h3 className="font-bold text-blue-800">Actions disponibles pour les clients</h3>
              <ul className="mt-2 text-sm text-blue-800 space-y-1">
                <li className="flex items-center"><FaPlus className="mr-2" /> Ajouter un nouveau client avec ses coordonnées complètes</li>
                <li className="flex items-center"><FaEye className="mr-2" /> Consulter la fiche détaillée d'un client</li>
                <li className="flex items-center"><FaEdit className="mr-2" /> Modifier les informations d'un client</li>
                <li className="flex items-center"><FaFileContract className="mr-2" /> Créer un devis pour ce client (depuis la fiche client)</li>
                <li className="flex items-center"><FaFileInvoiceDollar className="mr-2" /> Créer une facture pour ce client (depuis la fiche client)</li>
                <li className="flex items-center"><FaTrash className="mr-2" /> Supprimer un client (après confirmation)</li>
              </ul>
              <p className="mt-2 text-sm text-blue-800">
                La fiche client vous permet également de consulter l'historique des devis et factures du client.
              </p>
              <button 
                onClick={() => setShowGuide(false)} 
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Masquer ce guide
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un client..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Factures
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant total
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{client.nom}</div>
                  <div className="text-sm text-gray-500">Depuis {client.dateCreation}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {client.contact}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {client.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {client.telephone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {client.facturesTotal}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {client.montantTotal}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link href={`/clients/${client.id}`} className="text-blue-600 hover:text-blue-900">
                      <FaEye />
                    </Link>
                    <Link href={`/clients/${client.id}/modifier`} className="text-green-600 hover:text-green-900">
                      <FaEdit />
                    </Link>
                    <button 
                      onClick={() => handleDeleteClient(client.id)} 
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
} 