"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  FaFileAlt, 
  FaPlus, 
  FaSearch, 
  FaEye,
  FaPaintBrush,
  FaTrashAlt
} from "react-icons/fa";

interface DevisItem {
  id: number;
  numero: string;
  clientId: number;
  client: {
    id: number;
    nom: string;
    email: string;
  };
  date: string;
  validite: string;
  statut: string;
  totalHT: number;
  totalTTC: number;
}

export default function Devis() {
  // États pour les devis et leur chargement
  const [devis, setDevis] = useState<DevisItem[]>([]);
  const [filteredDevis, setFilteredDevis] = useState<DevisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");

  // Charger les devis depuis l'API
  useEffect(() => {
    const fetchDevis = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/devis');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des devis');
        }
        
        const data = await response.json();
        console.log('Devis chargés:', data);
        setDevis(data);
        setFilteredDevis(data);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger les devis. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchDevis();
  }, []);

  // Fonction de recherche
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    filterDevis(value, statusFilter);
  };

  // Fonction de filtrage par statut
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterDevis(searchTerm, status);
  };

  // Fonction combinée de filtrage
  const filterDevis = (search: string, status: string) => {
    let filtered = devis;
    
    // Filtre par recherche
    if (search) {
      filtered = filtered.filter(devis => 
        devis.numero.toLowerCase().includes(search) || 
        devis.client.nom.toLowerCase().includes(search)
      );
    }
    
    // Filtre par statut
    if (status !== "Tous") {
      filtered = filtered.filter(devis => devis.statut === status);
    }
    
    setFilteredDevis(filtered);
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepté':
      case 'accepté':
        return 'bg-green-100 text-green-800';
      case 'En attente':
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Refusé':
      case 'refusé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Formater une date au format local
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Formater un montant en euros
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  // Fonction pour supprimer un devis
  const handleDeleteDevis = async (id: number, numero: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le devis ${numero} ?`)) {
      try {
        const response = await fetch(`/api/devis/${id}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la suppression du devis');
        }
        
        alert('Devis supprimé avec succès !');
        
        // Mettre à jour la liste des devis
        setDevis(prevDevis => prevDevis.filter(d => d.id !== id));
        setFilteredDevis(prevFiltered => prevFiltered.filter(d => d.id !== id));
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        alert(`Erreur lors de la suppression: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
    }
  };

  return (
    <div className="space-y-6 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* En-tête avec titre et actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-800">Devis</h2>
          <p className="text-gray-500 mt-1">
            Gérez vos devis et propositions commerciales
          </p>
        </div>
        <Link 
          href="/devis/nouveau/"
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center w-full sm:w-auto justify-center"
        >
          <FaPlus className="mr-2" />
          Nouveau devis
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
          placeholder="Rechercher un devis..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Filtres par statut */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          onClick={() => handleStatusFilter("Tous")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            statusFilter === "Tous" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Tous
        </button>
        <button 
          onClick={() => handleStatusFilter("En attente")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            statusFilter === "En attente" ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          En attente
        </button>
        <button 
          onClick={() => handleStatusFilter("Accepté")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            statusFilter === "Accepté" ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Acceptés
        </button>
        <button 
          onClick={() => handleStatusFilter("Refusé")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            statusFilter === "Refusé" ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Refusés
        </button>
      </div>

      {/* Statistiques des devis - version mobile (grille 2x2) et desktop (grille 4x1) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total des devis</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{devis.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaFileAlt className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">En attente</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">
                {devis.filter(d => d.statut.toLowerCase() === "en attente").length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaFileAlt className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Acceptés</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">
                {devis.filter(d => d.statut.toLowerCase() === "accepté").length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaFileAlt className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Montant total</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">
                {formatAmount(devis.reduce((sum, d) => sum + d.totalTTC, 0))}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaPaintBrush className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Affichage pendant le chargement */}
      {loading && (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
        </div>
      )}

      {/* Message quand aucun devis n'est présent */}
      {!loading && !error && filteredDevis.length === 0 && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <FaFileAlt className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-lg font-medium">Aucun devis</p>
          <p className="mt-1">Commencez par créer votre premier devis en cliquant sur &apos;Nouveau devis&apos;.</p>
        </div>
      )}

      {/* Liste des devis - version desktop (visible seulement si des devis existent) */}
      {!loading && !error && filteredDevis.length > 0 && (
        <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Devis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-blue-600">
                      <Link href={`/devis/${devis.id}`}>{devis.numero}</Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <Link href={`/clients/${devis.clientId}`}>{devis.client.nom}</Link>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{devis.client.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatAmount(devis.totalTTC)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(devis.date)}</div>
                    <div className="text-xs text-gray-500 mt-1">→ {formatDate(devis.validite)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(devis.statut)}`}>
                      {devis.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        href={`/devis/${devis.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir le détail"
                      >
                        <FaEye />
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer le devis"
                        onClick={() => handleDeleteDevis(devis.id, devis.numero)}
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