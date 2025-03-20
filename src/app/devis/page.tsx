"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  FaFileAlt, 
  FaPlus, 
  FaSearch, 
  FaArrowRight,
  FaEye,
  FaTrashAlt,
  FaPaintBrush
} from "react-icons/fa";

export default function Devis() {
  // Tableau de devis vide par défaut
  const devisData: Array<{
    id: string;
    client: string;
    clientId: number;
    montant: string;
    date: string;
    dateValidite: string;
    statut: string;
    description: string;
  }> = [];

  // États pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [devis, setDevis] = useState(devisData);

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
    let filtered = devisData;
    
    // Filtre par recherche
    if (search) {
      filtered = filtered.filter(devis => 
        devis.id.toLowerCase().includes(search) || 
        devis.client.toLowerCase().includes(search) || 
        devis.description.toLowerCase().includes(search)
      );
    }
    
    // Filtre par statut
    if (status !== "Tous") {
      filtered = filtered.filter(devis => devis.statut === status);
    }
    
    setDevis(filtered);
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepté':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Refusé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{devisData.length}</p>
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
                {devisData.filter(d => d.statut === "En attente").length}
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
                {devisData.filter(d => d.statut === "Accepté").length}
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
              <p className="text-xl sm:text-2xl font-bold text-gray-800">0,00 €</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaPaintBrush className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Message quand aucun devis n'est présent */}
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <FaFileAlt className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <p className="text-lg font-medium">Aucun devis</p>
        <p className="mt-1">Commencez par créer votre premier devis en cliquant sur &apos;Nouveau devis&apos;.</p>
      </div>

      {/* Liste des devis - version desktop (visible seulement si des devis existent) */}
      {devis.length > 0 && (
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
              {devis.map((devis) => (
                <tr key={devis.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-blue-600">
                      <Link href={`/devis/${devis.id}`}>{devis.id}</Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <Link href={`/clients/${devis.clientId}`}>{devis.client}</Link>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{devis.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{devis.montant}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{devis.date}</div>
                    <div className="text-xs text-gray-500 mt-1">Valid. {devis.dateValidite}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(devis.statut)}`}>
                      {devis.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <Link href={`/devis/${devis.id}`} className="text-blue-600 hover:text-blue-900">
                        <FaEye title="Voir le détail" />
                      </Link>
                      <Link href={`/devis/${devis.id}/modifier`} className="text-amber-600 hover:text-amber-900">
                        <FaPaintBrush title="Modifier" />
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => alert(`Supprimer le devis ${devis.id}`)}
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

      {/* Liste des devis - version mobile (visible seulement si des devis existent) */}
      {devis.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:hidden">
          {devis.map((devis) => (
            <div key={devis.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <Link href={`/devis/${devis.id}`} className="font-medium text-blue-600">
                  {devis.id}
                </Link>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(devis.statut)}`}>
                  {devis.statut}
                </span>
              </div>
              <div className="mb-2">
                <Link href={`/clients/${devis.clientId}`} className="font-medium text-gray-800">
                  {devis.client}
                </Link>
                <p className="text-sm text-gray-600 mt-1">{devis.description}</p>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <div>
                  <p className="font-medium text-gray-900">{devis.montant}</p>
                </div>
                <div className="text-right">
                  <p>Créé le {devis.date}</p>
                  <p className="text-xs">Valide jusqu&apos;au {devis.dateValidite}</p>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                <Link 
                  href={`/devis/${devis.id}`} 
                  className="flex items-center text-blue-600"
                >
                  Voir détails
                  <FaArrowRight className="ml-1 h-3 w-3" />
                </Link>
                <div className="flex space-x-2">
                  <Link 
                    href={`/devis/${devis.id}/modifier`} 
                    className="bg-amber-100 text-amber-600 p-2 rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    <FaPaintBrush className="w-4 h-4" title="Modifier" />
                  </Link>
                  <button 
                    className="bg-red-100 text-red-600 p-2 rounded-full w-8 h-8 flex items-center justify-center"
                    onClick={() => alert(`Supprimer le devis ${devis.id}`)}
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