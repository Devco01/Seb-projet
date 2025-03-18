"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  FaMoneyBillWave, 
  FaPlus, 
  FaSearch, 
  FaEye,
  FaFileInvoiceDollar,
  FaTrashAlt,
  FaCalendarAlt,
  FaEuroSign
} from "react-icons/fa";

export default function Paiements() {
  // Données de paiements fictives pour la démo
  const paiementsData = [
    { 
      id: "P-2024-001", 
      facture: "F-2024-001",
      factureId: "F-2024-001",
      client: "Dupont Immobilier", 
      clientId: 1,
      montant: "3 250,00 €", 
      date: "20/03/2024", 
      mode: "Virement bancaire",
      statut: "Reçu",
      notes: "Paiement reçu pour peinture des murs intérieurs"
    },
    { 
      id: "P-2024-002", 
      facture: "F-2024-004",
      factureId: "F-2024-004",
      client: "Lepetit SCI", 
      clientId: 4,
      montant: "2 000,00 €", 
      date: "15/03/2024", 
      mode: "Chèque",
      statut: "Reçu",
      notes: "Acompte pour ravalement façade"
    },
    { 
      id: "P-2024-003", 
      facture: "F-2024-005",
      factureId: "F-2024-005",
      client: "Moreau Construction", 
      clientId: 5,
      montant: "12 480,25 €", 
      date: "10/03/2024", 
      mode: "Virement bancaire",
      statut: "Reçu",
      notes: "Paiement complet pour peinture logements neufs"
    },
    { 
      id: "P-2024-004", 
      facture: "F-2023-039",
      factureId: "F-2023-039",
      client: "Dubois & Fils", 
      clientId: 3,
      montant: "4 750,00 €", 
      date: "01/03/2024", 
      mode: "Virement bancaire",
      statut: "Reçu",
      notes: "Paiement tardif pour travaux bureaux décembre 2023"
    },
    { 
      id: "P-2024-005", 
      facture: "F-2023-038",
      factureId: "F-2023-038",
      client: "Martin Résidences", 
      clientId: 2,
      montant: "1 850,50 €", 
      date: "28/02/2024", 
      mode: "Chèque",
      statut: "Reçu",
      notes: "Paiement retards peinture hall d'entrée"
    }
  ];

  // États pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState("");
  const [modeFilter, setModeFilter] = useState("Tous");
  const [paiements, setPaiements] = useState(paiementsData);

  // Fonction de recherche
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    filterPaiements(value, modeFilter);
  };

  // Fonction de filtrage par mode de paiement
  const handleModeFilter = (mode) => {
    setModeFilter(mode);
    filterPaiements(searchTerm, mode);
  };

  // Fonction combinée de filtrage
  const filterPaiements = (search, mode) => {
    let filtered = paiementsData;
    
    // Filtre par recherche
    if (search) {
      filtered = filtered.filter(paiement => 
        paiement.id.toLowerCase().includes(search) || 
        paiement.facture.toLowerCase().includes(search) || 
        paiement.client.toLowerCase().includes(search) || 
        paiement.notes.toLowerCase().includes(search)
      );
    }
    
    // Filtre par mode de paiement
    if (mode !== "Tous") {
      filtered = filtered.filter(paiement => paiement.mode === mode);
    }
    
    setPaiements(filtered);
  };

  // Calcul des totaux pour les statistiques
  const totalMontant = paiementsData.reduce((sum, paiement) => {
    const montant = parseFloat(paiement.montant.replace(/[^\d,-]/g, '').replace(',', '.'));
    return sum + montant;
  }, 0).toFixed(2).replace('.', ',') + " €";

  // On calcule le montant par mode de paiement
  const montantVirements = paiementsData
    .filter(p => p.mode === "Virement bancaire")
    .reduce((sum, paiement) => {
      const montant = parseFloat(paiement.montant.replace(/[^\d,-]/g, '').replace(',', '.'));
      return sum + montant;
    }, 0).toFixed(2).replace('.', ',') + " €";

  const montantCheques = paiementsData
    .filter(p => p.mode === "Chèque")
    .reduce((sum, paiement) => {
      const montant = parseFloat(paiement.montant.replace(/[^\d,-]/g, '').replace(',', '.'));
      return sum + montant;
    }, 0).toFixed(2).replace('.', ',') + " €";

  return (
    <div className="space-y-6 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* En-tête avec titre et actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-800">Paiements</h2>
          <p className="text-gray-500 mt-1">
            Suivez les paiements reçus de vos clients
          </p>
        </div>
        <Link 
          href="/paiements/nouveau/"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center w-full sm:w-auto justify-center"
        >
          <FaPlus className="mr-2" />
          Enregistrer un paiement
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
          placeholder="Rechercher un paiement..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Filtres par mode de paiement */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          onClick={() => handleModeFilter("Tous")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            modeFilter === "Tous" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Tous
        </button>
        <button 
          onClick={() => handleModeFilter("Virement bancaire")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            modeFilter === "Virement bancaire" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Virements
        </button>
        <button 
          onClick={() => handleModeFilter("Chèque")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            modeFilter === "Chèque" ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Chèques
        </button>
      </div>

      {/* Statistiques des paiements */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total encaissé</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{totalMontant}</p>
              <p className="text-xs text-gray-500 mt-1">{paiementsData.length} paiements</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaMoneyBillWave className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Virements bancaires</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{montantVirements}</p>
              <p className="text-xs text-gray-500 mt-1">
                {paiementsData.filter(p => p.mode === "Virement bancaire").length} paiements
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaEuroSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Chèques</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{montantCheques}</p>
              <p className="text-xs text-gray-500 mt-1">
                {paiementsData.filter(p => p.mode === "Chèque").length} paiements
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaCalendarAlt className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des paiements - version desktop */}
      <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Référence
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Facture
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mode
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paiements.length > 0 ? (
              paiements.map((paiement) => (
                <tr key={paiement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/paiements/${paiement.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                      {paiement.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/factures/${paiement.factureId}`} className="text-gray-700 hover:text-blue-600">
                      {paiement.facture}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/clients/${paiement.clientId}`} className="text-gray-700 hover:text-blue-600">
                      {paiement.client}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {paiement.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {paiement.montant}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      paiement.mode === "Virement bancaire" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-purple-100 text-purple-800"
                    }`}>
                      {paiement.mode}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-3 justify-end">
                      <Link href={`/paiements/${paiement.id}`} className="text-blue-600 hover:text-blue-900" title="Voir">
                        <FaEye />
                      </Link>
                      <Link href={`/factures/${paiement.factureId}`} className="text-indigo-600 hover:text-indigo-900" title="Voir la facture">
                        <FaFileInvoiceDollar />
                      </Link>
                      <button className="text-red-600 hover:text-red-900" title="Supprimer">
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                  <p className="text-lg font-medium">Aucun paiement trouvé</p>
                  <p className="mt-1">Essayez de modifier vos filtres ou enregistrez un nouveau paiement.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cartes des paiements - version mobile */}
      <div className="sm:hidden space-y-4">
        {paiements.length > 0 ? (
          paiements.map((paiement) => (
            <div key={paiement.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-3">
                <Link href={`/paiements/${paiement.id}`} className="font-medium text-blue-600 text-lg">
                  {paiement.id}
                </Link>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                  paiement.mode === "Virement bancaire" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-purple-100 text-purple-800"
                }`}>
                  {paiement.mode}
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <p className="text-gray-700 font-semibold">{paiement.client}</p>
                  <p className="font-bold">{paiement.montant}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <Link href={`/factures/${paiement.factureId}`} className="text-blue-600">
                    Facture: {paiement.facture}
                  </Link>
                  <p>{paiement.date}</p>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-3 line-clamp-2">
                {paiement.notes}
              </div>
              
              <div className="flex justify-between border-t pt-3">
                <Link href={`/paiements/${paiement.id}`} className="text-blue-600 flex items-center text-sm">
                  <FaEye className="mr-1" /> Détails
                </Link>
                <Link href={`/factures/${paiement.factureId}`} className="text-indigo-600 flex items-center text-sm">
                  <FaFileInvoiceDollar className="mr-1" /> Facture
                </Link>
                <button className="text-red-600 flex items-center text-sm">
                  <FaTrashAlt className="mr-1" /> Supprimer
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            <p className="text-lg font-medium">Aucun paiement trouvé</p>
            <p className="mt-1">Essayez de modifier vos filtres ou enregistrez un nouveau paiement.</p>
          </div>
        )}
      </div>
    </div>
  );
} 