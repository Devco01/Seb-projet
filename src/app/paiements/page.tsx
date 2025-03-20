"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  FaMoneyBillWave, 
  FaPlus, 
  FaSearch, 
  FaEye,
  FaTrashAlt,
  FaEuroSign
} from "react-icons/fa";

export default function Paiements() {
  interface Paiement {
    id: string;
    facture: string;
    factureId: string;
    client: string;
    clientId: number;
    montant: string;
    date: string;
    mode: string;
    statut: string;
    notes: string;
  }

  // Tableau de paiements vide par défaut
  const paiementsData: Paiement[] = [];

  // États pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState("");
  const [paiements, setPaiements] = useState(paiementsData);

  // Fonction de recherche
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    filterPaiements(value);
  };

  // Fonction combinée de filtrage
  const filterPaiements = (search: string) => {
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
    
    setPaiements(filtered);
  };

  // Calcul des totaux pour les statistiques
  const totalMontant = paiementsData.reduce((sum, paiement) => {
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

      {/* Statistiques des paiements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{totalMontant}</p>
              <p className="text-xs text-gray-500 mt-1">
                {paiementsData.length} paiements
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaEuroSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Message quand aucun paiement n'est présent */}
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <FaMoneyBillWave className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <p className="text-lg font-medium">Aucun paiement</p>
        <p className="mt-1">Commencez par enregistrer votre premier paiement en cliquant sur &apos;Enregistrer un paiement&apos;.</p>
      </div>

      {/* Liste des paiements - version desktop */}
      {paiements.length > 0 && (
        <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Référence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client / Facture
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paiements.map((paiement) => (
                <tr key={paiement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-blue-600">
                      <Link href={`/paiements/${paiement.id}`}>{paiement.id}</Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <Link href={`/clients/${paiement.clientId}`} className="hover:text-blue-600">
                        {paiement.client}
                      </Link>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <Link href={`/factures/${paiement.factureId}`} className="hover:text-blue-600">
                        Facture: {paiement.facture}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{paiement.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{paiement.montant}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <Link href={`/paiements/${paiement.id}`} className="text-blue-600 hover:text-blue-900">
                        <FaEye title="Voir le détail" />
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => alert(`Supprimer le paiement ${paiement.id}?`)}
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

      {/* Liste des paiements - version mobile */}
      {paiements.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:hidden">
          {paiements.map((paiement) => (
            <div key={paiement.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <Link href={`/paiements/${paiement.id}`} className="font-medium text-blue-600">
                  {paiement.id}
                </Link>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {paiement.mode}
                </span>
              </div>
              <div className="mb-2">
                <Link href={`/clients/${paiement.clientId}`} className="font-medium text-gray-800">
                  {paiement.client}
                </Link>
                <div className="text-xs text-gray-500 mt-1">
                  <Link href={`/factures/${paiement.factureId}`} className="hover:text-blue-600">
                    Facture: {paiement.facture}
                  </Link>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <div>
                  <p>Date: {paiement.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{paiement.montant}</p>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                <Link href={`/paiements/${paiement.id}`} className="text-blue-600">
                  Voir détails
                </Link>
                <button
                  className="bg-red-100 text-red-600 p-2 rounded-full w-8 h-8 flex items-center justify-center"
                  onClick={() => alert(`Supprimer le paiement ${paiement.id}?`)}
                >
                  <FaTrashAlt className="w-4 h-4" title="Supprimer" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 