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
  // Données de devis fictives pour la démo
  const devisData = [
    { 
      id: "D-2024-001", 
      client: "Dupont Immobilier", 
      clientId: 1,
      montant: "3 250,00 €", 
      date: "15/03/2024", 
      dateValidite: "15/04/2024",
      statut: "En attente",
      description: "Peinture des murs intérieurs - Résidence Les Lilas"
    },
    { 
      id: "D-2024-002", 
      client: "Martin Résidences", 
      clientId: 2,
      montant: "4 820,75 €", 
      date: "10/03/2024", 
      dateValidite: "10/04/2024",
      statut: "Accepté",
      description: "Rénovation façade extérieure - Immeuble Victor Hugo"
    },
    { 
      id: "D-2024-003", 
      client: "Dubois & Fils", 
      clientId: 3,
      montant: "2 150,50 €", 
      date: "05/03/2024", 
      dateValidite: "05/04/2024",
      statut: "Refusé",
      description: "Peinture bureaux - Étage 3"
    },
    { 
      id: "D-2024-004", 
      client: "Lepetit SCI", 
      clientId: 4,
      montant: "6 750,00 €", 
      date: "18/03/2024", 
      dateValidite: "18/04/2024",
      statut: "En attente",
      description: "Ravalement façade - Copropriété République"
    },
    { 
      id: "D-2024-005", 
      client: "Moreau Construction", 
      clientId: 5,
      montant: "12 480,25 €", 
      date: "12/03/2024", 
      dateValidite: "12/04/2024",
      statut: "Accepté",
      description: "Peinture logements neufs - Résidence Haussmann"
    }
  ];

  // États pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [devis, setDevis] = useState(devisData);

  // Fonction de recherche
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    filterDevis(value, statusFilter);
  };

  // Fonction de filtrage par statut
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    filterDevis(searchTerm, status);
  };

  // Fonction combinée de filtrage
  const filterDevis = (search, status) => {
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

  return (
    <div className="space-y-6 pb-16">
      {/* En-tête avec titre et actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-blue-800">Devis</h2>
          <p className="text-gray-500">
            Gérez vos devis et propositions commerciales
          </p>
        </div>
        <Link 
          href="/devis/nouveau/"
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center w-full md:w-auto justify-center"
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
      <div className="flex space-x-2 mb-4">
        <button 
          onClick={() => handleStatusFilter("Tous")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            statusFilter === "Tous" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Tous
        </button>
        <button 
          onClick={() => handleStatusFilter("En attente")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            statusFilter === "En attente" ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          En attente
        </button>
        <button 
          onClick={() => handleStatusFilter("Accepté")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            statusFilter === "Accepté" ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Acceptés
        </button>
        <button 
          onClick={() => handleStatusFilter("Refusé")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            statusFilter === "Refusé" ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Refusés
        </button>
      </div>

      {/* Statistiques des devis */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total des devis</p>
              <p className="text-2xl font-bold text-gray-800">{devisData.length}</p>
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
              <p className="text-2xl font-bold text-gray-800">
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
              <p className="text-2xl font-bold text-gray-800">
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
              <p className="text-2xl font-bold text-gray-800">29 451,50 €</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaPaintBrush className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des devis */}
      <div className="bg-white rounded-lg shadow">
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
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date / Validité
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {devis.length > 0 ? (
              devis.map((devis) => (
                <tr key={devis.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link href={`/devis/${devis.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      {devis.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/clients/${devis.clientId}`} className="text-gray-900 hover:text-blue-600">
                      {devis.client}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-2">
                      {devis.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{devis.montant}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{devis.date}</div>
                    <div className="text-xs text-gray-500">
                      Valide jusqu&apos;au {devis.dateValidite}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                      devis.statut === 'Accepté' ? 'bg-green-100 text-green-800' :
                      devis.statut === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {devis.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <Link href={`/devis/${devis.id}`} className="text-blue-600 hover:text-blue-900">
                        <FaEye title="Voir le devis" />
                      </Link>
                      <Link href={`/factures/nouveau?devis=${devis.id}`} className="text-green-600 hover:text-green-900">
                        <FaArrowRight title="Convertir en facture" />
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
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                  <FaFileAlt className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-lg font-medium">Aucun devis trouvé</p>
                  <p className="mt-1">Ajoutez un nouveau devis ou modifiez vos filtres.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 