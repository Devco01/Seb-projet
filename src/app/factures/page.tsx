"use client";

import Link from "next/link";
import { useState } from "react";
import { FaFileInvoiceDollar, FaPlus, FaSearch, FaEye, FaEdit, FaTrashAlt, FaFilePdf } from "react-icons/fa";

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

  return (
    <div className="space-y-6 pb-16">
      {/* En-tête avec titre et action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-blue-800">Factures</h2>
          <p className="text-gray-500">
            Gérez vos factures et suivez leurs statuts
          </p>
        </div>
        <Link 
          href="/factures/nouveau/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center w-full md:w-auto justify-center"
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
      <div className="flex space-x-2 mb-4">
        <button 
          onClick={() => handleStatusFilter("Toutes")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            statusFilter === "Toutes" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Toutes
        </button>
        <button 
          onClick={() => handleStatusFilter("Payée")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            statusFilter === "Payée" ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Payées
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
          onClick={() => handleStatusFilter("En retard")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            statusFilter === "En retard" ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          En retard
        </button>
      </div>

      {/* Table des factures */}
      <div className="bg-white rounded-lg shadow">
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
                  <td className="px-6 py-4">
                    <Link href={`/clients/${facture.client.id}`} className="text-gray-900 hover:text-blue-600">
                      {facture.client.nom}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-gray-800">Émise le: {formatDate(facture.date)}</div>
                      <div className="text-gray-500">Échéance: {formatDate(facture.echeance)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{formatMontant(facture.montantTTC)}</div>
                    <div className="text-sm text-gray-500">HT: {formatMontant(facture.montantHT)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                      facture.statut === 'Payée' ? 'bg-green-100 text-green-800' :
                      facture.statut === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {facture.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <Link href={`/factures/${facture.id}`} className="text-blue-600 hover:text-blue-900">
                        <FaEye title="Voir les détails" />
                      </Link>
                      <Link href={`/factures/${facture.id}/modifier`} className="text-amber-600 hover:text-amber-900">
                        <FaEdit title="Modifier" />
                      </Link>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => alert(`Supprimer la facture ${facture.numero}`)}
                      >
                        <FaTrashAlt title="Supprimer" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <FaFilePdf title="Télécharger PDF" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  <FaFileInvoiceDollar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-lg font-medium">Aucune facture trouvée</p>
                  <p className="mt-1">Créez une nouvelle facture ou modifiez vos critères de recherche.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Résumé des factures */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Montant total</h3>
          <p className="text-2xl font-bold text-blue-600">
            {formatMontant(factures.reduce((sum, facture) => sum + facture.montantTTC, 0))}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-2">En attente de paiement</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {formatMontant(factures
              .filter(f => f.statut === "En attente")
              .reduce((sum, facture) => sum + facture.montantTTC, 0)
            )}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-2">En retard</h3>
          <p className="text-2xl font-bold text-red-600">
            {formatMontant(factures
              .filter(f => f.statut === "En retard")
              .reduce((sum, facture) => sum + facture.montantTTC, 0)
            )}
          </p>
        </div>
      </div>
    </div>
  );
} 