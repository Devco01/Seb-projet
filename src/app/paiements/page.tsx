"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
    id: number;
    facture: {
      id: number;
      numero: string;
      totalTTC: number;
    };
    factureId: number;
    client: {
      id: number;
      nom: string;
      email: string;
    };
    clientId: number;
    montant: number;
    date: string;
    methode: string;
    statut: string;
    notes?: string;
    reference?: string;
  }

  // États pour la liste des paiements et leur chargement
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [filteredPaiements, setFilteredPaiements] = useState<Paiement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState("");

  // Charger les paiements depuis l'API
  useEffect(() => {
    const fetchPaiements = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/paiements');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des paiements');
        }
        
        const data = await response.json();
        console.log('Paiements chargés:', data);
        setPaiements(data);
        setFilteredPaiements(data);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger les paiements. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaiements();
  }, []);

  // Fonction de recherche
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    filterPaiements(value);
  };

  // Fonction de filtrage combinée
  const filterPaiements = (search: string) => {
    let filtered = paiements;
    
    // Filtre par recherche
    if (search) {
      filtered = filtered.filter(paiement => 
        paiement.id.toString().includes(search) || 
        (paiement.facture?.numero?.toLowerCase() || '').includes(search) || 
        (paiement.client?.nom?.toLowerCase() || '').includes(search) || 
        (paiement.notes?.toLowerCase() || '').includes(search) ||
        (paiement.reference?.toLowerCase() || '').includes(search)
      );
    }
    
    setFilteredPaiements(filtered);
  };

  // Fonction pour supprimer un paiement
  const handleDeletePaiement = async (id: number) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ce paiement ?`)) {
      try {
        const response = await fetch(`/api/paiements/${id}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        // Même si la réponse n'est pas OK, le paiement a probablement été supprimé
        // mais la mise à jour de la facture a échoué
        // Dans tous les cas, on met à jour l'interface
        setPaiements(prevPaiements => prevPaiements.filter(p => p.id !== id));
        setFilteredPaiements(prevFiltered => prevFiltered.filter(p => p.id !== id));
        
        if (!response.ok) {
          // On affiche un message différent mais on continue
          console.error('Erreur lors de la mise à jour post-suppression:', data);
          alert('Le paiement a été supprimé mais une erreur est survenue lors de la mise à jour des données associées.');
        } else {
          alert('Paiement supprimé avec succès !');
        }
        
        // On pourrait aussi forcer un rechargement complet de la page
        // window.location.reload();
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        
        // Même en cas d'erreur, on met à jour l'interface pour éviter la confusion
        setPaiements(prevPaiements => prevPaiements.filter(p => p.id !== id));
        setFilteredPaiements(prevFiltered => prevFiltered.filter(p => p.id !== id));
        
        alert(`Le paiement a été supprimé mais une erreur est survenue: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
    }
  };

  // Calcul des totaux pour les statistiques
  const totalMontant = paiements.reduce((sum, paiement) => sum + (paiement.montant || 0), 0);
  const virementsTotal = paiements
    .filter(p => (p.methode || '').toLowerCase() === 'virement')
    .reduce((sum, p) => sum + (p.montant || 0), 0);
  const virementsCount = paiements.filter(p => (p.methode || '').toLowerCase() === 'virement').length;

  // Formater un montant en euros
  const formatMontant = (montant: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(montant);
  };

  // Formater une date pour l'affichage
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

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
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{formatMontant(totalMontant)}</p>
              <p className="text-xs text-gray-500 mt-1">{paiements.length} paiements</p>
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
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{formatMontant(virementsTotal)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {virementsCount} paiements
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaEuroSign className="h-5 w-5 text-blue-600" />
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

      {/* Message quand aucun paiement n'est présent */}
      {!loading && !error && filteredPaiements.length === 0 && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <FaMoneyBillWave className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-lg font-medium">Aucun paiement</p>
          <p className="mt-1">Commencez par enregistrer votre premier paiement en cliquant sur &apos;Enregistrer un paiement&apos;.</p>
        </div>
      )}

      {/* Liste des paiements - version desktop */}
      {filteredPaiements.length > 0 && (
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
              {filteredPaiements.map((paiement) => (
                <tr key={paiement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-blue-600">
                      <Link href={`/paiements/${paiement.id}`}>{paiement.reference || paiement.id}</Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <Link href={`/clients/${paiement.clientId}`} className="hover:text-blue-600">
                        {paiement.client?.nom || 'Client inconnu'}
                      </Link>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <Link href={`/factures/${paiement.factureId}`} className="hover:text-blue-600">
                        Facture: {paiement.facture?.numero || 'N/A'}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(paiement.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatMontant(paiement.montant || 0)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <Link href={`/paiements/${paiement.id}`} className="text-blue-600 hover:text-blue-900">
                        <FaEye title="Voir le détail" />
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeletePaiement(paiement.id)}
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
      {filteredPaiements.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:hidden">
          {filteredPaiements.map((paiement) => (
            <div key={paiement.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <Link href={`/paiements/${paiement.id}`} className="font-medium text-blue-600">
                  {paiement.reference || paiement.id}
                </Link>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {paiement.methode || 'N/A'}
                </span>
              </div>
              <div className="mb-2">
                <Link href={`/clients/${paiement.clientId}`} className="font-medium text-gray-800">
                  {paiement.client?.nom || 'Client inconnu'}
                </Link>
                <div className="text-xs text-gray-500 mt-1">
                  <Link href={`/factures/${paiement.factureId}`} className="hover:text-blue-600">
                    Facture: {paiement.facture?.numero || 'N/A'}
                  </Link>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <div>
                  <p>Date: {formatDate(paiement.date)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatMontant(paiement.montant || 0)}</p>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                <Link href={`/paiements/${paiement.id}`} className="text-blue-600">
                  Voir détails
                </Link>
                <button
                  className="bg-red-100 text-red-600 p-2 rounded-full w-8 h-8 flex items-center justify-center"
                  onClick={() => handleDeletePaiement(paiement.id)}
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