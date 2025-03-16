"use client";

import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaFileDownload, FaEnvelope, FaCheck, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';

// Type pour les factures
type Facture = {
  id: number;
  numero: string;
  date: string;
  echeance: string;
  statut: string;
  clientId: number;
  client: {
    id: number;
    nom: string;
    email: string;
  };
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  conditions?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export default function Factures() {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [factureToDelete, setFactureToDelete] = useState<number | null>(null);

  // Fonction pour récupérer les factures
  const fetchFactures = async () => {
    setIsLoading(true);
    setError('');
    try {
      console.log('Tentative de récupération des factures...');
      const response = await fetch('/api/factures');
      
      if (!response.ok) {
        console.error('Réponse non OK:', response.status, response.statusText);
        throw new Error('Erreur lors de la récupération des factures');
      }
      
      const data = await response.json();
      console.log('Données reçues:', data);
      setFactures(data);
    } catch (err) {
      console.error('Erreur complète:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer les factures depuis l'API au chargement
  useEffect(() => {
    fetchFactures();
  }, []);

  // Filtrer les factures en fonction du terme de recherche
  const filteredFactures = factures.filter(f => 
    f.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.statut.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gérer la suppression d'une facture
  const handleDeleteFacture = async (id: number) => {
    try {
      const response = await fetch(`/api/factures/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la facture');
      }
      
      // Mettre à jour la liste des factures
      setFactures(factures.filter(f => f.id !== id));
      setShowDeleteModal(false);
      setFactureToDelete(null);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  // Ouvrir la modal de confirmation de suppression
  const openDeleteModal = (id: number) => {
    setFactureToDelete(id);
    setShowDeleteModal(true);
  };

  // Marquer une facture comme payée
  const handleMarkAsPaid = async (id: number) => {
    try {
      const response = await fetch(`/api/factures/${id}/mark-as-paid`, {
        method: 'PATCH',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du marquage de la facture comme payée');
      }
      
      // Rafraîchir la liste des factures
      fetchFactures();
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  // Formater un montant en euros
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montant);
  };

  // Formater une date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Obtenir la couleur pour le statut
  const getStatusColor = (statut: string) => {
    switch (statut.toLowerCase()) {
      case 'brouillon':
        return 'bg-gray-100 text-gray-800';
      case 'envoyée':
        return 'bg-blue-100 text-blue-800';
      case 'payée':
        return 'bg-green-100 text-green-800';
      case 'en retard':
        return 'bg-red-100 text-red-800';
      case 'annulée':
        return 'bg-yellow-100 text-yellow-800';
      case 'partiellement payée':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Factures</h1>
          <p className="text-gray-600">Gérez vos factures et suivez les paiements</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => fetchFactures()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center mr-2"
          >
            <FaSearch className="mr-2" /> Rafraîchir
          </button>
          <Link 
            href="/factures/nouveau" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" /> Nouvelle facture
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une facture..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des factures...</p>
          </div>
        ) : filteredFactures.length === 0 ? (
          <div className="p-8 text-center">
            <FaInfoCircle className="text-gray-400 text-4xl mx-auto mb-4" />
            <p className="text-gray-600">Aucune facture trouvée</p>
            {searchTerm ? (
              <p className="text-gray-500 mt-2">Essayez de modifier votre recherche</p>
            ) : (
              <p className="text-gray-500 mt-2">Commencez par créer une nouvelle facture</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFactures.map((facture) => (
                  <tr key={facture.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 font-medium">{facture.numero}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{formatDate(facture.date)}</div>
                      <div className="text-gray-500 text-sm">Échéance: {formatDate(facture.echeance)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{facture.client.nom}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 font-medium">{formatMontant(facture.totalTTC)}</div>
                      <div className="text-gray-500 text-sm">HT: {formatMontant(facture.totalHT)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(facture.statut)}`}>
                        {facture.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/factures/${facture.id}`} className="text-blue-600 hover:text-blue-900">
                          <FaEye className="text-lg" title="Voir" />
                        </Link>
                        <Link href={`/factures/${facture.id}/edit`} className="text-green-600 hover:text-green-900">
                          <FaEdit className="text-lg" title="Modifier" />
                        </Link>
                        <button 
                          onClick={() => openDeleteModal(facture.id)} 
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="text-lg" title="Supprimer" />
                        </button>
                        <button 
                          onClick={() => handleMarkAsPaid(facture.id)} 
                          className="text-green-600 hover:text-green-900"
                          disabled={facture.statut.toLowerCase() === 'payée'}
                        >
                          <FaCheck className="text-lg" title="Marquer comme payée" />
                        </button>
                        <Link href={`/factures/${facture.id}/pdf`} className="text-orange-600 hover:text-orange-900">
                          <FaFileDownload className="text-lg" title="Télécharger PDF" />
                        </Link>
                        <Link href={`/factures/${facture.id}/email`} className="text-indigo-600 hover:text-indigo-900">
                          <FaEnvelope className="text-lg" title="Envoyer par email" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
            <p className="mb-6 text-gray-600">Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible.</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={() => factureToDelete && handleDeleteFacture(factureToDelete)} 
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
} 