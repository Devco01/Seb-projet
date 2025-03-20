"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrashAlt, FaFilePdf } from "react-icons/fa";

export default function Factures() {
  // Types nécessaires pour les factures
  interface Facture {
    id: number;
    numero: string;
    date: string;
    echeance: string;
    client: {
      id: number;
      nom: string;
      email: string;
    };
    totalHT: number;
    totalTTC: number;
    statut: string;
  }

  // États pour la liste des factures et leur chargement
  const [factures, setFactures] = useState<Facture[]>([]);
  const [filteredFactures, setFilteredFactures] = useState<Facture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Toutes");

  // Charger les factures depuis l'API
  useEffect(() => {
    const fetchFactures = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/factures');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des factures');
        }
        
        const data = await response.json();
        console.log('Factures chargées:', data);
        setFactures(data);
        setFilteredFactures(data);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger les factures. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchFactures();
  }, []);

  // Fonction pour formater un montant en euros
  const formatMontant = (montant: number): string => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montant);
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  // Fonction de recherche
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    filterFactures(value, statusFilter);
  };

  // Fonction de filtrage par statut
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterFactures(searchTerm, status);
  };

  // Fonction de filtrage combinée
  const filterFactures = (search: string, status: string) => {
    let filtered = factures;
    
    // Filtre de recherche
    if (search) {
      filtered = filtered.filter(facture => 
        facture.numero.toLowerCase().includes(search) || 
        facture.client.nom.toLowerCase().includes(search)
      );
    }
    
    // Filtre de statut
    if (status !== "Toutes") {
      filtered = filtered.filter(facture => facture.statut === status);
    }
    
    setFilteredFactures(filtered);
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Payée':
      case 'payée':
        return 'bg-green-100 text-green-800';
      case 'En attente':
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'En retard':
      case 'en retard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour supprimer une facture
  const handleDeleteFacture = async (id: number, numero: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la facture ${numero} ?`)) {
      try {
        const response = await fetch(`/api/factures/${id}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Erreur lors de la suppression de la facture');
        }
        
        // Mettre à jour la liste des factures
        setFactures(prevFactures => prevFactures.filter(f => f.id !== id));
        setFilteredFactures(prevFiltered => prevFiltered.filter(f => f.id !== id));
        
        alert('Facture supprimée avec succès !');
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        alert(`Erreur lors de la suppression: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
    }
  };

  return (
    <div className="space-y-6 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* En-tête avec titre et action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-800">Factures</h2>
          <p className="text-gray-500 mt-1">
            Gérez vos factures et suivez leurs statuts
          </p>
        </div>
        <Link 
          href="/factures/nouveau/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center w-full sm:w-auto justify-center"
        >
          <FaPlus className="mr-2" />
          Nouvelle facture
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
          placeholder="Rechercher une facture..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Filtres par statut */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          onClick={() => handleStatusFilter("Toutes")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            statusFilter === "Toutes" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Toutes
        </button>
        <button 
          onClick={() => handleStatusFilter("Payée")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            statusFilter === "Payée" ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Payées
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
          onClick={() => handleStatusFilter("En retard")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            statusFilter === "En retard" ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          En retard
        </button>
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

      {/* Message quand aucune facture n'est présente */}
      {!loading && !error && filteredFactures.length === 0 && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <FaFilePdf className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-lg font-medium">Aucune facture</p>
          <p className="mt-1">Commencez par créer votre première facture en cliquant sur &apos;Nouvelle facture&apos;.</p>
        </div>
      )}

      {/* Table des factures - version desktop */}
      {filteredFactures.length > 0 && (
        <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  FACTURE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CLIENT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DATE / ÉCHÉANCE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MONTANT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STATUT
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFactures.map((facture) => (
                <tr key={facture.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/factures/${facture.id}`} className="text-blue-600 font-medium">
                      {facture.numero}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/clients/${facture.client.id}`} className="text-gray-900 hover:text-blue-600">
                      {facture.client.nom}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{formatDate(facture.date)}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Échéance: {formatDate(facture.echeance)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {formatMontant(facture.totalTTC)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      HT: {formatMontant(facture.totalHT)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(facture.statut)}`}>
                      {facture.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <Link href={`/factures/${facture.id}`} className="text-blue-600 hover:text-blue-900">
                        <FaEye title="Voir" />
                      </Link>
                      <Link href={`/factures/${facture.id}/modifier`} className="text-amber-600 hover:text-amber-900">
                        <FaEdit title="Modifier" />
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteFacture(facture.id, facture.numero)}
                      >
                        <FaTrashAlt title="Supprimer" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Liste des factures - version mobile */}
      {filteredFactures.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:hidden">
          {filteredFactures.map((facture) => (
            <div key={facture.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <Link href={`/factures/${facture.id}`} className="font-medium text-blue-600">
                  {facture.numero}
                </Link>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(facture.statut)}`}>
                  {facture.statut}
                </span>
              </div>
              <div className="mb-2">
                <Link href={`/clients/${facture.client.id}`} className="font-medium text-gray-800">
                  {facture.client.nom}
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-3">
                <div>
                  <p>Date: {formatDate(facture.date)}</p>
                  <p>Échéance: {formatDate(facture.echeance)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatMontant(facture.totalTTC)}</p>
                  <p>HT: {formatMontant(facture.totalHT)}</p>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                <Link href={`/factures/${facture.id}`} className="text-blue-600">
                  Voir détails
                </Link>
                <div className="flex space-x-2">
                  <Link 
                    href={`/factures/${facture.id}/modifier`} 
                    className="bg-amber-100 text-amber-600 p-2 rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    <FaEdit className="w-4 h-4" title="Modifier" />
                  </Link>
                  <button 
                    className="bg-red-100 text-red-600 p-2 rounded-full w-8 h-8 flex items-center justify-center"
                    onClick={() => handleDeleteFacture(facture.id, facture.numero)}
                  >
                    <FaTrashAlt className="w-4 h-4" title="Supprimer" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 