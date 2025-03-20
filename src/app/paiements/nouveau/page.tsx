'use client';

import { useState } from 'react';
import { FaSave, FaTimes, FaSpinner, FaPrint, FaMoneyBillWave } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NouveauPaiement() {
  const router = useRouter();
  const [factureId, setFactureId] = useState('');
  const [montant, setMontant] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fonction pour imprimer le paiement
  const handlePrint = () => {
    window.print();
  };

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
      
      // Simulation de succès (pas d'appel API réel)
      setTimeout(() => {
        setSuccessMessage('Paiement en espèces enregistré avec succès');
        
        // Rediriger vers la page des paiements après 2 secondes
        setTimeout(() => {
          router.push('/paiements');
        }, 2000);
      }, 1000);
      
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
          <h1 className="text-3xl font-bold">Nouveau paiement en espèces</h1>
          <p className="text-gray-600">Enregistrez un paiement en espèces pour une facture</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button
            onClick={handlePrint}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPrint className="mr-2" /> Imprimer
          </button>
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
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
              <input
                type="text"
                id="facture"
                name="facture"
                value={factureId}
                onChange={(e) => setFactureId(e.target.value)}
                className="w-full focus:outline-none"
                placeholder="Entrez le numéro de facture"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Entrez manuellement le numéro de votre facture</p>
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
            <div className="relative">
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
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">€</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="moyenPaiement">
              Moyen de paiement
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-gray-100">
              <FaMoneyBillWave className="text-green-600 mr-2" />
              <span>Espèces</span>
            </div>
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
            placeholder="Référence du paiement (optionnel)"
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
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Notes concernant ce paiement (optionnel)"
          ></textarea>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FaMoneyBillWave className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Information sur le paiement en espèces</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Rappel : N&apos;oubliez pas de remettre un reçu à votre client pour tout paiement en espèces.</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 