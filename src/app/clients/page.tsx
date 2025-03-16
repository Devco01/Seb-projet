"use client";

import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaInfoCircle, FaFileInvoiceDollar, FaFileContract, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { useClients } from '@/hooks/useClients';
import { useRouter } from 'next/navigation';

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showGuide, setShowGuide] = useState(true);
  const router = useRouter();
  
  // Utiliser le hook useClients pour récupérer les clients
  const { clients, loading, error, fetchClients } = useClients();
  
  // Forcer le rechargement des clients au montage du composant
  useEffect(() => {
    console.log("Page clients montée, rechargement des clients");
    fetchClients();
  }, [fetchClients]);

  // Filtrer les clients en fonction du terme de recherche
  const filteredClients = clients.filter(client => 
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.contact && client.contact.toLowerCase().includes(searchTerm.toLowerCase())) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour supprimer un client
  const handleDeleteClient = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        const response = await fetch(`/api/clients/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Recharger la liste des clients
          fetchClients();
          alert('Client supprimé avec succès');
        } else {
          const data = await response.json();
          alert(`Erreur: ${data.error || 'Impossible de supprimer ce client'}`);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Une erreur est survenue lors de la suppression');
      }
    }
  };

  // Fonction pour rafraîchir la page
  const handleRefresh = () => {
    console.log("Rafraîchissement manuel des clients");
    fetchClients();
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Clients</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md flex items-center"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : "Rafraîchir"}
          </button>
          <Link
            href="/clients/nouveau"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FaPlus className="mr-2" /> Nouveau client
          </Link>
        </div>
      </div>

      {showGuide && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
          <div className="flex items-start">
            <FaInfoCircle className="text-blue-500 mt-1 mr-3" />
            <div>
              <h3 className="font-bold text-blue-800">Actions disponibles pour les clients</h3>
              <ul className="mt-2 text-sm text-blue-800 space-y-1">
                <li className="flex items-center"><FaPlus className="mr-2" /> Ajouter un nouveau client avec ses coordonnées complètes</li>
                <li className="flex items-center"><FaEye className="mr-2" /> Consulter la fiche détaillée d&apos;un client</li>
                <li className="flex items-center"><FaEdit className="mr-2" /> Modifier les informations d&apos;un client</li>
                <li className="flex items-center"><FaFileContract className="mr-2" /> Créer un devis pour ce client (depuis la fiche client)</li>
                <li className="flex items-center"><FaFileInvoiceDollar className="mr-2" /> Créer une facture pour ce client (depuis la fiche client)</li>
                <li className="flex items-center"><FaTrash className="mr-2" /> Supprimer un client (après confirmation)</li>
              </ul>
              <p className="mt-2 text-sm text-blue-800">
                La fiche client vous permet également de consulter l&apos;historique des devis et factures du client.
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

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <p className="text-red-700">Erreur: {error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Rechercher un client..."
                className="w-full px-4 py-2 border rounded-md pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <FaSpinner className="animate-spin inline-block mr-2" />
            Chargement des clients...
          </div>
        ) : filteredClients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
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
                    Ville
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.contact || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.telephone || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.ville}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/clients/${client.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir les détails"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          href={`/clients/${client.id}/modifier`}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Modifier"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDeleteClient(client.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <FaTrash />
                        </button>
                        <Link
                          href={`/devis/nouveau?clientId=${client.id}`}
                          className="text-green-600 hover:text-green-900"
                          title="Créer un devis"
                        >
                          <FaFileContract />
                        </Link>
                        <Link
                          href={`/factures/nouveau?clientId=${client.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Créer une facture"
                        >
                          <FaFileInvoiceDollar />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            Aucun client trouvé. Voulez-vous{" "}
            <Link href="/clients/nouveau" className="text-blue-600 hover:text-blue-800">
              en créer un nouveau
            </Link>
            ?
          </div>
        )}

        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de <span className="font-medium">{filteredClients.length}</span> clients
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 