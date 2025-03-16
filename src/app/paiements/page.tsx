"use client";

import { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaInfoCircle, FaFileInvoiceDollar, FaCheck } from 'react-icons/fa';
import Link from 'next/link';

// Données fictives pour les paiements
const paiementsData = [
  { 
    id: 1, 
    facture: 'F-2023-042', 
    client: 'Dupont SAS', 
    date: '20/06/2023', 
    montant: '2 500 €',
    methode: 'Virement bancaire',
    statut: 'Reçu',
    statutColor: 'bg-green-100 text-green-800'
  },
  { 
    id: 2, 
    facture: 'F-2023-039', 
    client: 'Résidences du Parc', 
    date: '15/06/2023', 
    montant: '1 950 €',
    methode: 'Chèque',
    statut: 'Reçu',
    statutColor: 'bg-green-100 text-green-800'
  },
  { 
    id: 3, 
    facture: 'F-2023-041', 
    client: 'Martin Construction', 
    date: '10/06/2023', 
    montant: '1 800 €',
    methode: 'Virement bancaire',
    statut: 'En attente',
    statutColor: 'bg-yellow-100 text-yellow-800'
  },
  { 
    id: 4, 
    facture: 'F-2023-040', 
    client: 'Dubois SARL', 
    date: '05/06/2023', 
    montant: '3 200 €',
    methode: 'Espèces',
    statut: 'En attente',
    statutColor: 'bg-yellow-100 text-yellow-800'
  },
];

export default function Paiements() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [paiements, setPaiements] = useState(paiementsData);
  const [showGuide, setShowGuide] = useState(true);

  // Filtrer les paiements en fonction du terme de recherche et du statut
  const filteredPaiements = paiements.filter(paiement => 
    (paiement.facture.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paiement.client.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'Tous' || paiement.statut === statusFilter)
  );

  // Fonction pour supprimer un paiement
  const handleDeletePaiement = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
      setPaiements(paiements.filter(paiement => paiement.id !== id));
    }
  };

  // Fonction pour marquer un paiement comme reçu
  // Cette fonction sera implémentée ultérieurement
  const _handleMarkAsReceived = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir marquer ce paiement comme reçu ?')) {
      setPaiements(paiements.map(paiement => 
        paiement.id === id ? { ...paiement, statut: 'Reçu' } : paiement
      ));
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Paiements</h1>
          <p className="text-gray-600">Suivez les paiements reçus et en attente</p>
        </div>
        <Link 
          href="/paiements/nouveau" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Nouveau paiement
        </Link>
      </div>

      {showGuide && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
          <div className="flex items-start">
            <FaInfoCircle className="text-blue-500 mt-1 mr-3" />
            <div>
              <h3 className="font-bold text-blue-800">Actions disponibles pour les paiements</h3>
              <ul className="mt-2 text-sm text-blue-800 space-y-1">
                <li className="flex items-center"><FaPlus className="mr-2" /> Enregistrer un nouveau paiement pour une facture existante</li>
                <li className="flex items-center"><FaEye className="mr-2" /> Consulter les détails d'un paiement</li>
                <li className="flex items-center"><FaEdit className="mr-2" /> Modifier les informations d'un paiement (date, méthode, montant)</li>
                <li className="flex items-center"><FaFileInvoiceDollar className="mr-2" /> Accéder à la facture associée au paiement</li>
                <li className="flex items-center"><FaCheck className="mr-2" /> Marquer un paiement en attente comme reçu</li>
                <li className="flex items-center"><FaTrash className="mr-2" /> Supprimer un paiement (après confirmation)</li>
              </ul>
              <p className="mt-2 text-sm text-blue-800">
                Le tableau de bord des paiements vous permet de suivre les montants reçus et en attente, ainsi que les méthodes de paiement utilisées.
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un paiement..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Tous">Tous les paiements</option>
              <option value="Reçu">Reçus</option>
              <option value="En attente">En attente</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Facture
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Méthode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPaiements.map((paiement) => (
              <tr key={paiement.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {paiement.facture}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {paiement.client}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {paiement.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {paiement.montant}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {paiement.methode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${paiement.statutColor}`}>
                    {paiement.statut}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link href={`/paiements/${paiement.id}`} className="text-blue-600 hover:text-blue-900">
                      <FaEye />
                    </Link>
                    <Link href={`/paiements/${paiement.id}/modifier`} className="text-green-600 hover:text-green-900">
                      <FaEdit />
                    </Link>
                    <button 
                      onClick={() => handleDeletePaiement(paiement.id)} 
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
        {filteredPaiements.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            Aucun paiement trouvé.
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Résumé des paiements</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-600">Total des paiements reçus</span>
              <span className="font-medium">4 450 €</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-600">Total des paiements en attente</span>
              <span className="font-medium">5 000 €</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-600">Paiements du mois en cours</span>
              <span className="font-medium">9 450 €</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Méthodes de paiement</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-600">Virement bancaire</span>
              <span className="font-medium">4 300 €</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-600">Chèque</span>
              <span className="font-medium">1 950 €</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-600">Espèces</span>
              <span className="font-medium">3 200 €</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 