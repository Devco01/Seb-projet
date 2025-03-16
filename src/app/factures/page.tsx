"use client";

import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaFileDownload, FaEnvelope, FaCheck, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';

// Définir l'interface pour les factures
interface Client {
  id: number;
  nom: string;
  email: string;
}

interface Facture {
  id: number;
  numero: string;
  date: string;
  echeance: string;
  totalTTC: number;
  statut: string;
  client: Client;
}

export default function Factures() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Toutes');
  const [factures, setFactures] = useState<Facture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(true);

  // Récupérer les factures depuis l'API
  useEffect(() => {
    const fetchFactures = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/factures');
        
        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des factures: ${response.status}`);
        }
        
        const data = await response.json();
        setFactures(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des factures:', err);
        setError('Impossible de charger les factures. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchFactures();
  }, []);

  // Filtrer les factures en fonction du terme de recherche et du statut
  const filteredFactures = factures.filter(facture => 
    (facture.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facture.client?.nom?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'Toutes' || facture.statut === statusFilter)
  );

  // Fonction pour supprimer une facture
  const handleDeleteFacture = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      try {
        const response = await fetch(`/api/factures/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`Erreur lors de la suppression: ${response.status}`);
        }
        
        // Mettre à jour l'état local après suppression
        setFactures(factures.filter(facture => facture.id !== id));
      } catch (err) {
        console.error('Erreur lors de la suppression de la facture:', err);
        alert('Impossible de supprimer la facture. Veuillez réessayer plus tard.');
      }
    }
  };

  // Fonction pour marquer une facture comme payée
  const handleMarkAsPaid = async (id: number) => {
    try {
      const response = await fetch(`/api/factures/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: 'Payée' }),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la mise à jour: ${response.status}`);
      }
      
      const updatedFacture = await response.json();
      
      // Mettre à jour l'état local
      setFactures(factures.map(facture => 
        facture.id === id ? updatedFacture : facture
      ));
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      alert('Impossible de mettre à jour le statut. Veuillez réessayer plus tard.');
    }
  };

  // Afficher un message de chargement
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des factures...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <MainLayout>
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaInfoCircle className="text-red-500 mt-1" />
            </div>
            <div className="ml-3">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Factures</h1>
          <p className="text-gray-600">Gérez vos factures et suivez leur statut</p>
        </div>
        <Link 
          href="/factures/nouveau" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Nouvelle facture
        </Link>
      </div>

      {showGuide && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
          <div className="flex items-start">
            <FaInfoCircle className="text-blue-500 mt-1 mr-3" />
            <div>
              <h3 className="font-bold text-blue-800">Actions disponibles pour les factures</h3>
              <ul className="mt-2 text-sm text-blue-800 space-y-1">
                <li className="flex items-center"><FaPlus className="mr-2" /> Créer une nouvelle facture avec détails client, prestations et conditions de paiement</li>
                <li className="flex items-center"><FaEye className="mr-2" /> Consulter les détails d'une facture existante</li>
                <li className="flex items-center"><FaEdit className="mr-2" /> Modifier une facture (uniquement si elle n'est pas encore payée)</li>
                <li className="flex items-center"><FaFileDownload className="mr-2" /> Télécharger la facture au format PDF</li>
                <li className="flex items-center"><FaEnvelope className="mr-2" /> Envoyer la facture par email au client</li>
                <li className="flex items-center"><FaCheck className="mr-2" /> Marquer une facture comme payée (crée automatiquement un paiement)</li>
                <li className="flex items-center"><FaTrash className="mr-2" /> Supprimer une facture (après confirmation)</li>
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
              placeholder="Rechercher une facture..."
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
              <option value="Toutes">Toutes les factures</option>
              <option value="Payée">Payées</option>
              <option value="En attente">En attente</option>
              <option value="Impayée">Impayées</option>
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
                Échéance
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
            {filteredFactures.map((facture) => (
              <tr key={facture.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {facture.numero}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {facture.client?.nom || 'Client inconnu'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(facture.date).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(facture.echeance).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {facture.totalTTC?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) || '0,00 €'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    facture.statut === 'Payée' ? 'bg-green-100 text-green-800' : 
                    facture.statut === 'En attente' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {facture.statut}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link href={`/factures/${facture.id}`} className="text-blue-600 hover:text-blue-900">
                      <FaEye />
                    </Link>
                    <Link href={`/factures/${facture.id}/modifier`} className="text-green-600 hover:text-green-900">
                      <FaEdit />
                    </Link>
                    <button className="text-purple-600 hover:text-purple-900">
                      <FaFileDownload />
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      <FaEnvelope />
                    </button>
                    {facture.statut !== 'Payée' && (
                      <button 
                        onClick={() => handleMarkAsPaid(facture.id)} 
                        className="text-green-600 hover:text-green-900"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteFacture(facture.id)} 
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
        {filteredFactures.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            Aucune facture trouvée.
          </div>
        )}
      </div>
    </MainLayout>
  );
} 