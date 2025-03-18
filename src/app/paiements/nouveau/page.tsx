'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaTimes, FaSpinner, FaFileInvoiceDollar } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Facture = {
  id: number;
  numero: string;
  clientId: number;
  clientNom: string;
  date: string;
  totalTTC: number;
  statut: string;
};

export default function NouveauPaiement() {
  const router = useRouter();
  const [factureId, setFactureId] = useState('');
  const [montant, setMontant] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [moyenPaiement, setMoyenPaiement] = useState('virement');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [factures, setFactures] = useState<Facture[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Récupérer les factures depuis l'API
  useEffect(() => {
    const fetchFactures = async () => {
      try {
        const response = await fetch('/api/factures');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des factures');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          // Filtrer les factures qui ont un statut "émise" ou "partiellement payée"
          const facturesPayables = data.filter((facture: Facture) => 
            facture.statut === 'émise' || facture.statut === 'partiellement payée'
          );
          setFactures(facturesPayables);
        } else {
          console.error('Les données factures reçues ne sont pas un tableau:', data);
          setFactures([]);
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setFactures([]);
      }
    };

    fetchFactures();
  }, []);

  // Mettre à jour le montant automatiquement lorsqu'une facture est sélectionnée
  useEffect(() => {
    if (factureId) {
      const facture = factures.find(f => f.id.toString() === factureId);
      if (facture) {
        setMontant(facture.totalTTC.toString());
      }
    }
  }, [factureId, factures]);

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Validation de base
      if (!factureId) {
        throw new Error('Veuillez sélectionner une facture');
      }
      
      if (!montant || parseFloat(montant) <= 0) {
        throw new Error('Le montant doit être supérieur à 0');
      }
      
      // Préparer les données
      const paiementData = {
        factureId: parseInt(factureId),
        date,
        montant: parseFloat(montant),
        moyenPaiement,
        reference,
        notes
      };
      
      // Envoi des données à l'API
      const response = await fetch('/api/paiements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paiementData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'enregistrement du paiement');
      }
      
      await response.json(); // On récupère les données mais on ne les utilise pas
      setSuccessMessage('Paiement enregistré avec succès');
      
      // Rediriger vers la page des paiements après 2 secondes
      setTimeout(() => {
        router.push('/paiements');
      }, 2000);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
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
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Link
            href="/paiements"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaTimes className="mr-2" /> Annuler
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            {isLoading ? <FaSpinner className="mr-2 animate-spin" /> : <FaSave className="mr-2" />}
            Enregistrer
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="facture">
              Facture <span className="text-red-500">*</span>
            </label>
            <select
              id="facture"
              name="facture"
              value={factureId}
              onChange={(e) => setFactureId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner une facture</option>
              {Array.isArray(factures) ? 
                factures.map((facture) => (
                  <option key={facture.id} value={facture.id}>
                    {facture.numero} - {facture.clientNom} ({facture.totalTTC.toFixed(2)} €)
                  </option>
                )) : 
                <option value="" disabled>Erreur lors du chargement des factures</option>
              }
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="date">
              Date du paiement
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="montant">
              Montant (€) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="montant"
              name="montant"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              step="0.01"
              min="0.01"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="moyenPaiement">
              Moyen de paiement
            </label>
            <select
              id="moyenPaiement"
              name="moyenPaiement"
              value={moyenPaiement}
              onChange={(e) => setMoyenPaiement(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="virement">Virement bancaire</option>
              <option value="cb">Carte bancaire</option>
              <option value="cheque">Chèque</option>
              <option value="especes">Espèces</option>
              <option value="autre">Autre</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="reference">
            Référence
          </label>
          <input
            type="text"
            id="reference"
            name="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Numéro de transaction, chèque..."
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Notes internes ou informations complémentaires..."
          />
        </div>

        {factureId && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <FaFileInvoiceDollar className="text-blue-600 mr-2" />
              <h3 className="text-lg font-medium">Détails de la facture</h3>
            </div>
            {Array.isArray(factures) && factures.filter(f => f.id.toString() === factureId).map(facture => (
              <div key={facture.id} className="mt-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Numéro:</div>
                  <div>{facture.numero}</div>
                  <div className="font-medium">Client:</div>
                  <div>{facture.clientNom}</div>
                  <div className="font-medium">Date:</div>
                  <div>{facture.date}</div>
                  <div className="font-medium">Montant:</div>
                  <div>{facture.totalTTC.toFixed(2)} €</div>
                  <div className="font-medium">Statut:</div>
                  <div>{facture.statut}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
} 