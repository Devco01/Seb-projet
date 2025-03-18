"use client";

import Link from "next/link";
import { useState } from "react";
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrashAlt, FaFilePdf } from "react-icons/fa";

export default function Factures() {
  // Types nécessaires pour les factures
  interface Facture {
    id: string;
    numero: string;
    date: string;
    echeance: string;
    client: {
      id: string;
      nom: string;
    };
    montantHT: number;
    montantTTC: number;
    statut: string;
  }

  // Données de facturation fictives
  const facturesData: Facture[] = [
    {
      id: "1",
      numero: "F-2023-001",
      date: "2023-05-15",
      echeance: "2023-06-15",
      client: {
        id: "1",
        nom: "Dupont Immobilier"
      },
      montantHT: 1000,
      montantTTC: 1200,
      statut: "Payée"
    },
    {
      id: "2",
      numero: "F-2023-002",
      date: "2023-06-05",
      echeance: "2023-07-05",
      client: {
        id: "2",
        nom: "Martin Résidences"
      },
      montantHT: 1500,
      montantTTC: 1800,
      statut: "En attente"
    },
    {
      id: "3",
      numero: "F-2023-003",
      date: "2023-07-12",
      echeance: "2023-08-12",
      client: {
        id: "3",
        nom: "Dubois & Fils"
      },
      montantHT: 2000,
      montantTTC: 2400,
      statut: "En retard"
    },
    {
      id: "4",
      numero: "F-2023-004",
      date: "2023-08-20",
      echeance: "2023-09-20",
      client: {
        id: "4",
        nom: "SCI Lepetit"
      },
      montantHT: 1200,
      montantTTC: 1440,
      statut: "Payée"
    },
    {
      id: "5",
      numero: "F-2023-005",
      date: "2023-09-08",
      echeance: "2023-10-08",
      client: {
        id: "5",
        nom: "Moreau Construction"
      },
      montantHT: 3000,
      montantTTC: 3600,
      statut: "En attente"
    }
  ];

  // États pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Toutes");
  const [factures, setFactures] = useState<Facture[]>(facturesData);
  // État de chargement (pour afficher un état de chargement si nécessaire)
  const [isLoading] = useState(false);

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
    let filtered = facturesData;
    
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
    
    setFactures(filtered);
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Payée':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'En retard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

      {/* Table des factures - version desktop */}
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
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  <p className="text-lg font-medium">Chargement des factures...</p>
                </td>
              </tr>
            ) : factures.length > 0 ? (
              factures.map((facture) => (
                <tr key={facture.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link href={`/factures/${facture.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                      {facture.numero}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{facture.client.nom}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{formatDate(facture.date)}</div>
                    <div className="text-gray-500 text-sm">Échéance: {formatDate(facture.echeance)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-medium">{formatMontant(facture.montantTTC)}</div>
                    <div className="text-gray-500 text-sm">HT: {formatMontant(facture.montantHT)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      facture.statut === "Payée" ? "bg-green-100 text-green-800" :
                      facture.statut === "En attente" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {facture.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex space-x-3 justify-end">
                      <Link href={`/factures/${facture.id}`} className="text-blue-600 hover:text-blue-900" title="Voir">
                        <FaEye />
                      </Link>
                      <Link href={`/factures/${facture.id}/modifier`} className="text-indigo-600 hover:text-indigo-900" title="Modifier">
                        <FaEdit />
                      </Link>
                      <button className="text-red-600 hover:text-red-900" title="Supprimer">
                        <FaTrashAlt />
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="Télécharger PDF">
                        <FaFilePdf />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  <p className="text-lg font-medium">Aucune facture trouvée</p>
                  <p className="mt-1">Essayez de modifier vos filtres ou créez votre première facture.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cartes des factures - version mobile */}
      <div className="sm:hidden space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
            <p className="text-lg font-medium">Chargement des factures...</p>
          </div>
        ) : factures.length > 0 ? (
          factures.map((facture) => (
            <div key={facture.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-3">
                <Link href={`/factures/${facture.id}`} className="font-medium text-blue-600 text-lg">
                  {facture.numero}
                </Link>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(facture.statut)}`}>
                  {facture.statut}
                </span>
              </div>
              
              <div className="mb-3">
                <p className="text-gray-700 font-semibold">{facture.client.nom}</p>
                <div className="flex flex-col text-sm text-gray-500 mt-1">
                  <span>Date: {formatDate(facture.date)}</span>
                  <span>Échéance: {formatDate(facture.echeance)}</span>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-gray-900 font-bold">{formatMontant(facture.montantTTC)}</p>
                <p className="text-sm text-gray-500">HT: {formatMontant(facture.montantHT)}</p>
              </div>
              
              <div className="flex justify-between border-t pt-3">
                <Link href={`/factures/${facture.id}`} className="text-blue-600 flex items-center text-sm">
                  <FaEye className="mr-1" /> Voir
                </Link>
                <Link href={`/factures/${facture.id}/modifier`} className="text-indigo-600 flex items-center text-sm">
                  <FaEdit className="mr-1" /> Modifier
                </Link>
                <button className="text-green-600 flex items-center text-sm">
                  <FaFilePdf className="mr-1" /> PDF
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            <p className="text-lg font-medium">Aucune facture trouvée</p>
            <p className="mt-1">Essayez de modifier vos filtres ou créez votre première facture.</p>
          </div>
        )}
      </div>
    </div>
  );
} 