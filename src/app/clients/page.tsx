"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  FaUsers, 
  FaUserPlus, 
  FaSearch, 
  FaFileInvoiceDollar,
  FaFileAlt,
  FaEnvelope,
  FaPhone,
  FaEye,
  FaTrashAlt,
  FaMapMarkerAlt,
  FaCalendarAlt
} from "react-icons/fa";

interface Client {
  id: number;
  nom: string;
  email: string;
  telephone: string | null;
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string | null;
  nbDevis?: number;
  nbFactures?: number;
  createdAt: string;
}

export default function Clients() {
  // États
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState<Client[]>([]);

  // Charger les clients depuis l'API
  useEffect(() => {
    fetchClients();
  }, []);

  // Récupérer tous les clients
  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/clients');
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des clients: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Clients récupérés:', data);
      
      // Formater les données
      const formattedClients = Array.isArray(data) ? data.map((client: Client) => ({
        ...client,
        nbDevis: 0, // Par défaut
        nbFactures: 0, // Par défaut
        createdAt: client.createdAt ? new Date(client.createdAt).toLocaleDateString('fr-FR') : 'N/A'
      })) : [];
      
      setClientsData(formattedClients);
      setClients(formattedClients);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer un client
  const handleDeleteClient = async (id: number, nom: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le client ${nom} ?`)) {
      try {
        const response = await fetch(`/api/clients/${id}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          // Si la suppression a échoué, afficher le message d'erreur
          if (data.details && data.details.devis > 0) {
            alert(`Impossible de supprimer ce client car il a ${data.details.devis} devis associé(s)`);
          } else if (data.details && data.details.factures > 0) {
            alert(`Impossible de supprimer ce client car il a ${data.details.factures} facture(s) associée(s)`);
          } else if (data.details && data.details.paiements > 0) {
            alert(`Impossible de supprimer ce client car il a ${data.details.paiements} paiement(s) associé(s)`);
          } else {
            alert(data.error || 'Erreur lors de la suppression du client');
          }
          return;
        }
        
        // Actualiser la liste des clients
        fetchClients();
        
        alert('Client supprimé avec succès !');
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        alert('Erreur lors de la suppression du client');
      }
    }
  };

  // Fonction de recherche
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value === "") {
      setClients(clientsData);
    } else {
      const filteredClients = clientsData.filter(client => 
        client.nom.toLowerCase().includes(value) || 
        client.email.toLowerCase().includes(value) ||
        client.adresse.toLowerCase().includes(value)
      );
      setClients(filteredClients);
    }
  };

  // Statut du client basé sur le nombre de factures et devis
  const getClientStatus = (client: Client) => {
    if ((client.nbFactures || 0) > 0) {
      return "text-green-600";
    } else if ((client.nbDevis || 0) > 0) {
      return "text-amber-600";
    } else {
      return "text-gray-600";
    }
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="space-y-6 px-4 sm:px-6 pb-16 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-800">Clients</h2>
            <p className="text-gray-500">Chargement des clients...</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-gray-200 rounded-full mb-3"></div>
            <div className="h-4 w-32 bg-gray-200 rounded mb-3"></div>
            <div className="h-3 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="space-y-6 px-4 sm:px-6 pb-16 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-800">Clients</h2>
            <p className="text-red-500">Erreur: {error}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-lg font-medium text-red-500">Impossible de charger les clients</p>
          <p className="mt-1">Veuillez réessayer plus tard ou contacter l&apos;assistance.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 pb-16 max-w-7xl mx-auto">
      {/* En-tête avec titre et actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-800">Clients</h2>
          <p className="text-gray-500">
            Gérez vos clients et leurs informations
          </p>
        </div>
        <Link 
          href="/clients/nouveau/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center w-full sm:w-auto justify-center mt-4 sm:mt-0"
        >
          <FaUserPlus className="mr-2" />
          Nouveau client
        </Link>
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Statistiques des clients */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total clients</p>
              <p className="text-2xl font-bold text-gray-800">{clientsData.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaUsers className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Devis créés</p>
              <p className="text-2xl font-bold text-gray-800">
                {clientsData.reduce((sum, client) => sum + (client.nbDevis || 0), 0)}
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <FaFileAlt className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Factures émises</p>
              <p className="text-2xl font-bold text-gray-800">
                {clientsData.reduce((sum, client) => sum + (client.nbFactures || 0), 0)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaFileInvoiceDollar className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Message quand aucun client n'est présent */}
      {clients.length === 0 && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <FaUsers className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-lg font-medium">Aucun client</p>
          <p className="mt-1">Commencez par ajouter votre premier client en cliquant sur &apos;Nouveau client&apos;.</p>
        </div>
      )}

      {/* Liste des clients - Version mobile (cards) */}
      {clients.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:hidden">
          {clients.map((client) => (
            <div key={client.id} className="bg-white rounded-lg shadow p-4">
              <div>
                <h3 className={`text-lg font-bold ${getClientStatus(client)}`}>{client.nom}</h3>
                <div className="mt-1 space-y-1 text-sm">
                  <div className="flex items-center text-gray-500">
                    <FaEnvelope className="mr-2 h-3 w-3" />
                    <a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a>
                  </div>
                  {client.telephone && (
                    <div className="flex items-center text-gray-500">
                      <FaPhone className="mr-2 h-3 w-3" />
                      <a href={`tel:${client.telephone}`}>{client.telephone}</a>
                    </div>
                  )}
                  <div className="flex items-center text-gray-500">
                    <FaMapMarkerAlt className="mr-2 h-3 w-3" />
                    <span>{client.adresse}, {client.codePostal} {client.ville}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <FaCalendarAlt className="mr-2 h-3 w-3" />
                    <span>Créé le {client.createdAt}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Link href={`/clients/${client.id}`} className="bg-blue-100 text-blue-600 p-2 rounded-full w-8 h-8 flex items-center justify-center">
                    <FaEye className="w-4 h-4" title="Voir le détail" />
                  </Link>
                  <button 
                    className="bg-red-100 text-red-600 p-2 rounded-full w-8 h-8 flex items-center justify-center"
                    onClick={() => handleDeleteClient(client.id, client.nom)}
                  >
                    <FaTrashAlt className="w-4 h-4" title="Supprimer" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Liste des clients - Version desktop (table) */}
      {clients.length > 0 && (
        <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email / Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Devis / Factures
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{client.nom}</div>
                    <div className="text-xs text-gray-500">{client.adresse}, {client.codePostal} {client.ville}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-blue-600">
                      <a href={`mailto:${client.email}`}>{client.email}</a>
                    </div>
                    <div className="text-sm text-gray-500">{client.telephone || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {client.nbDevis || 0} devis
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {client.nbFactures || 0} factures
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        href={`/clients/${client.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir le détail"
                      >
                        <FaEye />
                      </Link>
                      <button
                        onClick={() => handleDeleteClient(client.id, client.nom)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer le client"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 