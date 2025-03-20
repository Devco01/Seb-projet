'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Facture {
  id: number;
  numero: string;
  clientId: number;
  client?: {
    nom: string;
  };
  totalTTC: number;
  resteAPayer?: number;
  statut: string;
}

export default function NouveauPaiement() {
  const router = useRouter();
  const [factureId, setFactureId] = useState('');
  const [montant, setMontant] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [methode, setMethode] = useState('Virement');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFactures, setIsLoadingFactures] = useState(true);
  const [factures, setFactures] = useState<Facture[]>([]);
  const [error, setError] = useState('');
  const [factureSelectionnee, setFactureSelectionnee] = useState<Facture | null>(null);
  const [clientId, setClientId] = useState('');

  // Charger la liste des factures
  useEffect(() => {
    const fetchFactures = async () => {
      try {
        const response = await fetch('/api/factures');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des factures');
        }
        
        const data = await response.json();
        
        // Calculer le reste à payer pour chaque facture
        const facturesAvecReste = data.map((facture: Facture) => {
          // Si resteAPayer n'est pas déjà défini, utiliser totalTTC
          if (facture.resteAPayer === undefined) {
            return {
              ...facture,
              resteAPayer: facture.totalTTC
            };
          }
          return facture;
        });
        
        // Filtrer les factures qui ne sont pas complètement payées
        const facturesNonPayees = facturesAvecReste.filter((facture: Facture) => 
          facture.statut !== 'Payée' && facture.resteAPayer > 0
        );
        
        setFactures(facturesNonPayees);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des factures');
      } finally {
        setIsLoadingFactures(false);
      }
    };
    
    fetchFactures();
  }, []);

  // Mettre à jour les détails de la facture sélectionnée
  useEffect(() => {
    if (factureId) {
      const facture = factures.find(f => f.id.toString() === factureId);
      if (facture) {
        setFactureSelectionnee(facture);
        setClientId(facture.clientId.toString());
        
        // Préremplir le montant avec le reste à payer si disponible
        if (facture.resteAPayer !== undefined) {
          setMontant(facture.resteAPayer.toString());
        } else {
          setMontant(facture.totalTTC.toString());
        }
      } else {
        setFactureSelectionnee(null);
        setClientId('');
      }
    } else {
      setFactureSelectionnee(null);
      setMontant('');
      setClientId('');
    }
  }, [factureId, factures]);

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Validation de base
      if (!factureId) {
        throw new Error('Veuillez sélectionner une facture');
      }
      
      if (!montant || parseFloat(montant) <= 0) {
        throw new Error('Le montant doit être supérieur à 0');
      }
      
      if (!methode) {
        throw new Error('Veuillez sélectionner un mode de paiement');
      }

      if (!clientId) {
        throw new Error('ID client manquant. Veuillez sélectionner une facture valide.');
      }
      
      // Préparer les données pour l'API
      const paiementData = {
        factureId: parseInt(factureId),
        clientId: parseInt(clientId),
        date,
        montant: parseFloat(montant),
        methode,
        reference: reference || '',
        notes: notes || ''
      };
      
      console.log('Données du paiement à envoyer:', paiementData);
      
      // Envoyer les données à l'API
      const response = await fetch('/api/paiements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paiementData),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Erreur lors de l\'enregistrement du paiement');
      }
      
      toast.success('Paiement enregistré avec succès');
      router.push('/paiements');
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 pb-16 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Nouveau paiement</h1>
          <p className="text-gray-600">Enregistrez un paiement pour une facture</p>
        </div>
        <div className="flex mt-4 sm:mt-0 space-x-2">
          <Link 
            href="/paiements" 
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaTimes className="mr-2" /> Annuler
          </Link>
        </div>
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sélection de la facture */}
            <div>
              <label htmlFor="factureId" className="block text-sm font-medium text-gray-700 mb-1">
                Facture
              </label>
              <select
                id="factureId"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={factureId}
                onChange={(e) => setFactureId(e.target.value)}
                required
                disabled={isLoading}
              >
                <option value="">Sélectionnez une facture</option>
                {factures.map((facture) => (
                  <option key={facture.id} value={facture.id.toString()}>
                    {facture.numero} - {facture.client?.nom} ({facture.resteAPayer ? facture.resteAPayer.toFixed(2) : facture.totalTTC.toFixed(2)} €)
                  </option>
                ))}
              </select>
              {isLoadingFactures && (
                <div className="mt-2 text-sm text-gray-500 flex items-center">
                  <FaSpinner className="animate-spin mr-1" /> Chargement des factures...
                </div>
              )}
              {factureSelectionnee && (
                <div className="mt-2 p-2 border rounded-md bg-blue-50">
                  <p className="text-sm font-medium">Facture: {factureSelectionnee.numero}</p>
                  <p className="text-sm">Client: {factureSelectionnee.client?.nom}</p>
                  <p className="text-sm">Total: {factureSelectionnee.totalTTC.toFixed(2)} €</p>
                  <p className="text-sm font-semibold text-blue-700">
                    Reste à payer: {(factureSelectionnee.resteAPayer || factureSelectionnee.totalTTC).toFixed(2)} €
                  </p>
                </div>
              )}
            </div>

            {/* Montant */}
            <div>
              <label htmlFor="montant" className="block text-sm font-medium text-gray-700 mb-1">
                Montant (€)
              </label>
              <input
                type="number"
                id="montant"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                step="0.01"
                min="0.01"
                required
                disabled={isLoading}
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date de paiement
              </label>
              <input
                type="date"
                id="date"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Méthode de paiement */}
            <div>
              <label htmlFor="methode" className="block text-sm font-medium text-gray-700 mb-1">
                Mode de paiement
              </label>
              <select
                id="methode"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={methode}
                onChange={(e) => setMethode(e.target.value)}
                required
                disabled={isLoading}
              >
                <option value="Virement">Virement bancaire</option>
                <option value="Chèque">Chèque</option>
                <option value="Espèces">Espèces</option>
                <option value="Carte">Carte bancaire</option>
              </select>
            </div>

            {/* Référence */}
            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
                Référence
              </label>
              <input
                type="text"
                id="reference"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Ex: Numéro de chèque, référence de virement..."
                disabled={isLoading}
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Informations complémentaires..."
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Enregistrement...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Enregistrer le paiement
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 