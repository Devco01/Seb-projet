"use client";

import { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaFileDownload, FaEnvelope, FaExchangeAlt, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';

// Données fictives pour les devis
const devisData = [
  { 
    id: 1, 
    numero: 'D-2023-056', 
    client: 'Dupont SAS', 
    date: '20/06/2023', 
    validite: '20/07/2023',
    montant: '3 200 €',
    statut: 'En attente',
    statutColor: 'bg-yellow-100 text-yellow-800'
  },
  { 
    id: 2, 
    numero: 'D-2023-055', 
    client: 'Martin Construction', 
    date: '15/06/2023', 
    validite: '15/07/2023',
    montant: '2 450 €',
    statut: 'Accepté',
    statutColor: 'bg-green-100 text-green-800'
  },
  { 
    id: 3, 
    numero: 'D-2023-054', 
    client: 'Dubois SARL', 
    date: '10/06/2023', 
    validite: '10/07/2023',
    montant: '1 800 €',
    statut: 'Refusé',
    statutColor: 'bg-red-100 text-red-800'
  },
  { 
    id: 4, 
    numero: 'D-2023-053', 
    client: 'Résidences du Parc', 
    date: '05/06/2023', 
    validite: '05/07/2023',
    montant: '4 100 €',
    statut: 'Converti en facture',
    statutColor: 'bg-blue-100 text-blue-800'
  },
];

export default function Devis() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [devis, setDevis] = useState(devisData);
  const [showGuide, setShowGuide] = useState(true);

  // Filtrer les devis en fonction du terme de recherche et du statut
  const filteredDevis = devis.filter(devis => 
    (devis.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    devis.client.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'Tous' || devis.statut === statusFilter)
  );

  // Fonction pour supprimer un devis
  const handleDeleteDevis = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
      setDevis(devis.filter(d => d.id !== id));
    }
  };

  // Fonction pour convertir un devis en facture
  const handleConvertToInvoice = (id: number) => {
    setDevis(devis.map(d => 
      d.id === id 
        ? { ...d, statut: 'Converti en facture', statutColor: 'bg-blue-100 text-blue-800' } 
        : d
    ));
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Devis</h1>
          <p className="text-gray-600">Gérez vos devis et suivez leur statut</p>
        </div>
        <Link 
          href="/devis/nouveau" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Nouveau devis
        </Link>
      </div>

      {showGuide && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
          <div className="flex items-start">
            <FaInfoCircle className="text-blue-500 mt-1 mr-3" />
            <div>
              <h3 className="font-bold text-blue-800">Actions disponibles pour les devis</h3>
              <ul className="mt-2 text-sm text-blue-800 space-y-1">
                <li className="flex items-center"><FaPlus className="mr-2" /> Créer un nouveau devis avec détails client, prestations et conditions</li>
                <li className="flex items-center"><FaEye className="mr-2" /> Consulter les détails d'un devis existant</li>
                <li className="flex items-center"><FaEdit className="mr-2" /> Modifier un devis (tant qu'il n'est pas converti en facture)</li>
                <li className="flex items-center"><FaFileDownload className="mr-2" /> Télécharger le devis au format PDF</li>
                <li className="flex items-center"><FaEnvelope className="mr-2" /> Envoyer le devis par email au client</li>
                <li className="flex items-center"><FaExchangeAlt className="mr-2" /> Convertir un devis accepté en facture</li>
                <li className="flex items-center"><FaTrash className="mr-2" /> Supprimer un devis (après confirmation)</li>
              </ul>
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
              placeholder="Rechercher un devis..."
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
              <option value="Tous">Tous les devis</option>
              <option value="En attente">En attente</option>
              <option value="Accepté">Acceptés</option>
              <option value="Refusé">Refusés</option>
              <option value="Converti en facture">Convertis en facture</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Numéro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Validité
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
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
            {filteredDevis.map((devis) => (
              <tr key={devis.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {devis.numero}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {devis.client}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {devis.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {devis.validite}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {devis.montant}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${devis.statutColor}`}>
                    {devis.statut}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link href={`/devis/${devis.id}`} className="text-blue-600 hover:text-blue-900">
                      <FaEye />
                    </Link>
                    <Link href={`/devis/${devis.id}/modifier`} className="text-green-600 hover:text-green-900">
                      <FaEdit />
                    </Link>
                    <button className="text-purple-600 hover:text-purple-900">
                      <FaFileDownload />
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      <FaEnvelope />
                    </button>
                    {devis.statut === 'Accepté' && (
                      <button 
                        onClick={() => handleConvertToInvoice(devis.id)} 
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FaExchangeAlt />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteDevis(devis.id)} 
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
        {filteredDevis.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            Aucun devis trouvé.
          </div>
        )}
      </div>
    </MainLayout>
  );
} 