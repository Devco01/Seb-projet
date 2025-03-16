"use client";

import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaInfoCircle, FaFileInvoiceDollar, FaFileContract } from 'react-icons/fa';
import Link from 'next/link';

// Type pour les clients
type Client = {
  id: number;
  nom: string;
  contact?: string;
  email: string;
  telephone?: string;
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string;
  siret?: string;
  tva?: string;
  notes?: string;
  createdAt: string;
};

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);

  // Fonction pour récupérer les clients
  const fetchClients = async () => {
    setIsLoading(true);
    setError('');
    try {
      console.log('Tentative de récupération des clients depuis le frontend...');
      const response = await fetch('/api/clients');
      
      if (!response.ok) {
        console.error('Réponse non OK:', response.status, response.statusText);
        throw new Error('Erreur lors de la récupération des clients');
      }
      
      const data = await response.json();
      console.log('Données reçues:', data);
      setClients(data);
    } catch (err) {
      console.error('Erreur complète:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer les clients depuis l'API au chargement
  useEffect(() => {
    fetchClients();
  }, []);

  // Filtrer les clients en fonction du terme de recherche
  const filteredClients = clients.filter(client => 
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.contact && client.contact.toLowerCase().includes(searchTerm.toLowerCase())) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gérer la suppression d'un client
  const handleDeleteClient = async (id: number) => {
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du client');
      }
      
      // Mettre à jour la liste des clients
      setClients(clients.filter(client => client.id !== id));
      setShowDeleteModal(false);
      setClientToDelete(null);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  // Ouvrir la modal de confirmation de suppression
  const openDeleteModal = (id: number) => {
    setClientToDelete(id);
    setShowDeleteModal(true);
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-gray-600">Gérez vos clients et leurs informations</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => fetchClients()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center mr-2"
          >
            <FaSearch className="mr-2" /> Rafraîchir
          </button>
          <Link 
            href="/clients/nouveau" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" /> Nouveau client
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
              placeholder="Rechercher un client..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des clients...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-8 text-center">
            <FaInfoCircle className="text-gray-400 text-4xl mx-auto mb-4" />
            <p className="text-gray-600">Aucun client trouvé</p>
            {searchTerm ? (
              <p className="text-gray-500 mt-2">Essayez de modifier votre recherche</p>
            ) : (
              <p className="text-gray-500 mt-2">Commencez par ajouter un nouveau client</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de création</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{client.nom}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">{client.contact || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">{client.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">{client.telephone || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">{`${client.adresse}, ${client.codePostal} ${client.ville}`}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">{new Date(client.createdAt).toLocaleDateString('fr-FR')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/clients/${client.id}`} className="text-blue-600 hover:text-blue-900">
                          <FaEye className="text-lg" title="Voir" />
                        </Link>
                        <Link href={`/clients/${client.id}/edit`} className="text-green-600 hover:text-green-900">
                          <FaEdit className="text-lg" title="Modifier" />
                        </Link>
                        <button 
                          onClick={() => openDeleteModal(client.id)} 
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="text-lg" title="Supprimer" />
                        </button>
                        <Link href={`/devis/nouveau?clientId=${client.id}`} className="text-orange-600 hover:text-orange-900">
                          <FaFileContract className="text-lg" title="Nouveau devis" />
                        </Link>
                        <Link href={`/factures/nouveau?clientId=${client.id}`} className="text-purple-600 hover:text-purple-900">
                          <FaFileInvoiceDollar className="text-lg" title="Nouvelle facture" />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
            <p className="mb-6">Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
              >
                Annuler
              </button>
              <button 
                onClick={() => clientToDelete && handleDeleteClient(clientToDelete)} 
                className="px-4 py-2 bg-red-600 text-white rounded-md"
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