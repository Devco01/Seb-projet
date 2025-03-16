"use client";

import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaFileDownload, FaEnvelope, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';

// Type pour les paiements
type Paiement = {
  id: number;
  factureId: number;
  clientId: number;
  date: string;
  montant: number;
  methode: string;
  reference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  client: {
    id: number;
    nom: string;
    email: string;
  };
  facture: {
    id: number;
    numero: string;
    totalTTC: number;
  };
};

export default function Paiements() {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paiementToDelete, setPaiementToDelete] = useState<number | null>(null);

  // Fonction pour récupérer les paiements
  const fetchPaiements = async () => {
    setIsLoading(true);
    setError('');
    try {
      console.log('Tentative de récupération des paiements...');
      const response = await fetch('/api/paiements');
      
      if (!response.ok) {
        console.error('Réponse non OK:', response.status, response.statusText);
        throw new Error('Erreur lors de la récupération des paiements');
      }
      
      const data = await response.json();
      console.log('Données reçues:', data);
      setPaiements(data);
    } catch (err) {
      console.error('Erreur complète:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer les paiements depuis l'API au chargement
  useEffect(() => {
    fetchPaiements();
  }, []);

  // Filtrer les paiements en fonction du terme de recherche
  const filteredPaiements = paiements.filter(p => 
    p.facture.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.methode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.reference && p.reference.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Gérer la suppression d'un paiement
  const handleDeletePaiement = async (id: number) => {
    try {
      const response = await fetch(`/api/paiements/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du paiement');
      }
      
      // Mettre à jour la liste des paiements
      setPaiements(paiements.filter(p => p.id !== id));
      setShowDeleteModal(false);
      setPaiementToDelete(null);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  // Ouvrir la modal de confirmation de suppression
  const openDeleteModal = (id: number) => {
    setPaiementToDelete(id);
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

  // Obtenir la couleur pour la méthode de paiement
  const getMethodeColor = (methode: string) => {
    switch (methode.toLowerCase()) {
      case 'virement':
        return 'bg-blue-100 text-blue-800';
      case 'chèque':
        return 'bg-green-100 text-green-800';
      case 'espèces':
        return 'bg-yellow-100 text-yellow-800';
      case 'carte bancaire':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Paiements</h1>
          <p className="text-gray-600">Gérez les paiements reçus de vos clients</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => fetchPaiements()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center mr-2"
          >
            <FaSearch className="mr-2" /> Rafraîchir
          </button>
          <Link 
            href="/paiements/nouveau" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" /> Nouveau paiement
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
              placeholder="Rechercher un paiement..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des paiements...</p>
          </div>
        ) : filteredPaiements.length === 0 ? (
          <div className="p-8 text-center">
            <FaInfoCircle className="text-gray-400 text-4xl mx-auto mb-4" />
            <p className="text-gray-600">Aucun paiement trouvé</p>
            {searchTerm ? (
              <p className="text-gray-500 mt-2">Essayez de modifier votre recherche</p>
            ) : (
              <p className="text-gray-500 mt-2">Commencez par enregistrer un nouveau paiement</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facture</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPaiements.map((paiement) => (
                  <tr key={paiement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{formatDate(paiement.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{paiement.client.nom}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/factures/${paiement.factureId}`} className="text-blue-600 hover:underline">
                        {paiement.facture.numero}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 font-medium">{formatMontant(paiement.montant)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getMethodeColor(paiement.methode)}`}>
                        {paiement.methode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">{paiement.reference || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/paiements/${paiement.id}`} className="text-blue-600 hover:text-blue-900">
                          <FaEye className="text-lg" title="Voir" />
                        </Link>
                        <Link href={`/paiements/${paiement.id}/edit`} className="text-green-600 hover:text-green-900">
                          <FaEdit className="text-lg" title="Modifier" />
                        </Link>
                        <button 
                          onClick={() => openDeleteModal(paiement.id)} 
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="text-lg" title="Supprimer" />
                        </button>
                        <Link href={`/paiements/${paiement.id}/recu`} className="text-orange-600 hover:text-orange-900">
                          <FaFileDownload className="text-lg" title="Télécharger reçu" />
                        </Link>
                        <Link href={`/paiements/${paiement.id}/email`} className="text-indigo-600 hover:text-indigo-900">
                          <FaEnvelope className="text-lg" title="Envoyer reçu par email" />
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
            <p className="mb-6 text-gray-600">Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action est irréversible.</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={() => paiementToDelete && handleDeletePaiement(paiementToDelete)} 
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