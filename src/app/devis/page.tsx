"use client";

import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaFileDownload, FaEnvelope, FaExchangeAlt, FaInfoCircle, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';

// Type pour les devis
type Devis = {
  id: number;
  numero: string;
  date: string;
  validite: string;
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

export default function Devis() {
  const [devis, setDevis] = useState<Devis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [devisToDelete, setDevisToDelete] = useState<number | null>(null);

  // Fonction pour récupérer les devis
  const fetchDevis = async () => {
    setIsLoading(true);
    setError('');
    try {
      console.log('Tentative de récupération des devis...');
      const response = await fetch('/api/devis');
      
      if (!response.ok) {
        console.error('Réponse non OK:', response.status, response.statusText);
        throw new Error('Erreur lors de la récupération des devis');
      }
      
      const data = await response.json();
      console.log('Données reçues:', data);
      setDevis(data);
    } catch (err) {
      console.error('Erreur complète:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer les devis depuis l'API au chargement
  useEffect(() => {
    fetchDevis();
  }, []);

  // Filtrer les devis en fonction du terme de recherche
  const filteredDevis = devis.filter(d => 
    d.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.statut.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gérer la suppression d'un devis
  const handleDeleteDevis = async (id: number) => {
    try {
      const response = await fetch(`/api/devis/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du devis');
      }
      
      // Mettre à jour la liste des devis
      setDevis(devis.filter(d => d.id !== id));
      setShowDeleteModal(false);
      setDevisToDelete(null);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  // Ouvrir la modal de confirmation de suppression
  const openDeleteModal = (id: number) => {
    setDevisToDelete(id);
    setShowDeleteModal(true);
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
      case 'envoyé':
        return 'bg-blue-100 text-blue-800';
      case 'accepté':
        return 'bg-green-100 text-green-800';
      case 'refusé':
        return 'bg-red-100 text-red-800';
      case 'expiré':
        return 'bg-yellow-100 text-yellow-800';
      case 'facturé':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Devis</h1>
          <p className="text-gray-600">Gérez vos devis et propositions commerciales</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => fetchDevis()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center mr-2"
          >
            <FaSearch className="mr-2" /> Rafraîchir
          </button>
          <Link 
            href="/devis/nouveau" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" /> Nouveau devis
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
              placeholder="Rechercher un devis..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <FaSpinner className="animate-spin text-blue-500 text-4xl" />
          </div>
        ) : filteredDevis.length === 0 ? (
          <div className="p-8 text-center">
            <FaInfoCircle className="text-gray-400 text-4xl mx-auto mb-4" />
            <p className="text-gray-600">Aucun devis trouvé</p>
            {searchTerm ? (
              <p className="text-gray-500 mt-2">Essayez de modifier votre recherche</p>
            ) : (
              <p className="text-gray-500 mt-2">Commencez par créer un nouveau devis</p>
            )}
          </div>
        ) : (
          <div className="table-responsive mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numéro
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDevis.map((devis) => (
                  <tr key={devis.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-gray-900 font-medium">{devis.numero}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-gray-900">{formatDate(devis.date)}</div>
                      <div className="text-xs text-gray-500">Valid: {formatDate(devis.validite)}</div>
                      {/* Afficher le client sur mobile uniquement */}
                      <div className="md:hidden text-xs text-gray-500 mt-1">
                        Client: {devis.client.nom}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap">
                      <div className="text-gray-900">{devis.client.nom}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-gray-900 font-medium">{formatMontant(devis.totalTTC)}</div>
                      {/* Afficher le statut sur mobile uniquement */}
                      <div className="md:hidden text-xs mt-1">
                        <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getStatusColor(devis.statut)}`}>
                          {devis.statut}
                        </span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getStatusColor(devis.statut)}`}>
                        {devis.statut}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex flex-col md:flex-row md:justify-end space-y-2 md:space-y-0 md:space-x-2">
                        <div className="flex space-x-2 justify-end">
                          <Link href={`/devis/${devis.id}`} className="text-blue-600 hover:text-blue-900">
                            <FaEye className="text-lg" title="Voir" />
                          </Link>
                          <Link href={`/devis/${devis.id}/edit`} className="text-green-600 hover:text-green-900">
                            <FaEdit className="text-lg" title="Modifier" />
                          </Link>
                          <button 
                            onClick={() => openDeleteModal(devis.id)} 
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash className="text-lg" title="Supprimer" />
                          </button>
                        </div>
                        <div className="flex space-x-2 justify-end">
                          <Link href={`/devis/${devis.id}/pdf`} className="text-orange-600 hover:text-orange-900">
                            <FaFileDownload className="text-lg" title="Télécharger PDF" />
                          </Link>
                          <Link href={`/devis/${devis.id}/email`} className="text-indigo-600 hover:text-indigo-900">
                            <FaEnvelope className="text-lg" title="Envoyer par email" />
                          </Link>
                          <Link href={`/devis/${devis.id}/facture`} className="text-purple-600 hover:text-purple-900">
                            <FaExchangeAlt className="text-lg" title="Convertir en facture" />
                          </Link>
                        </div>
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
            <p className="mb-6 text-gray-600">Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible.</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={() => devisToDelete && handleDeleteDevis(devisToDelete)} 
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