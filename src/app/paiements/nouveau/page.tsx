'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import { FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Facture = {
  id: number;
  numero: string;
  clientId: number;
  totalTTC: number;
  statut: string;
  client: {
    id: number;
    nom: string;
  };
};

export default function NouveauPaiement() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    factureId: '',
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    montant: '',
    methode: 'Virement bancaire',
    reference: '',
    notes: ''
  });
  const [factures, setFactures] = useState<Facture[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFactures, setIsLoadingFactures] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formInitialized, setFormInitialized] = useState(false);

  // Méthodes de paiement disponibles
  const methodesPaiement = [
    'Virement bancaire',
    'Chèque',
    'Espèces',
    'Carte bancaire',
    'Prélèvement automatique'
  ];

  // Récupérer les factures depuis l'API
  useEffect(() => {
    const fetchFactures = async () => {
      try {
        const response = await fetch('/api/factures');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des factures');
        }
        const data = await response.json();
        // Filtrer les factures qui peuvent recevoir un paiement (non payées)
        const facturesNonPayees = data.filter((facture: Facture) => 
          facture.statut?.toLowerCase() !== 'payée'
        );
        setFactures(facturesNonPayees);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoadingFactures(false);
      }
    };

    fetchFactures();
  }, []);

  // Charger les données du formulaire depuis le localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && !formInitialized) {
      const savedForm = localStorage.getItem('nouveauPaiementForm');
      if (savedForm) {
        try {
          const parsedForm = JSON.parse(savedForm);
          setFormData(prevData => ({
            ...prevData,
            ...parsedForm
          }));
        } catch (err) {
          console.error('Erreur lors du chargement du formulaire:', err);
        }
      }
      setFormInitialized(true);
    }
  }, [formInitialized]);

  // Sauvegarder les données du formulaire dans le localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && formInitialized) {
      localStorage.setItem('nouveauPaiementForm', JSON.stringify(formData));
    }
  }, [formData, formInitialized]);

  // Gestion des changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Si la facture change, mettre à jour automatiquement le client et le montant
    if (name === 'factureId' && value) {
      const factureSelectionnee = factures.find(f => f.id.toString() === value);
      if (factureSelectionnee) {
        setFormData(prev => ({
          ...prev,
          clientId: factureSelectionnee.clientId.toString(),
          montant: factureSelectionnee.totalTTC.toString()
        }));
      }
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Validation de base
      if (!formData.factureId) {
        throw new Error('Veuillez sélectionner une facture');
      }
      
      if (!formData.montant || parseFloat(formData.montant) <= 0) {
        throw new Error('Le montant doit être supérieur à 0');
      }
      
      // Préparer les données
      const paiementData = {
        factureId: parseInt(formData.factureId),
        clientId: parseInt(formData.clientId),
        date: formData.date,
        montant: parseFloat(formData.montant),
        methode: formData.methode,
        reference: formData.reference,
        notes: formData.notes
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
        throw new Error(errorData.message || 'Erreur lors de la création du paiement');
      }
      
      const data = await response.json();
      setSuccessMessage('Paiement enregistré avec succès');
      
      // Effacer les données du localStorage après création réussie
      localStorage.removeItem('nouveauPaiementForm');
      
      // Rediriger vers la page de détails du paiement après 2 secondes
      setTimeout(() => {
        router.push(`/paiements/${data.id}`);
      }, 2000);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Nouveau paiement</h1>
          <p className="text-gray-600">Enregistrez un nouveau paiement pour une facture</p>
        </div>
        <div className="flex space-x-2">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="factureId">
              Facture <span className="text-red-500">*</span>
            </label>
            <select
              id="factureId"
              name="factureId"
              value={formData.factureId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoadingFactures}
            >
              <option value="">Sélectionnez une facture</option>
              {isLoadingFactures ? (
                <option value="" disabled>Chargement des factures...</option>
              ) : (
                factures.map((facture) => (
                  <option key={facture.id} value={facture.id}>
                    {facture.numero} - {facture.client.nom} ({facture.totalTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="date">
              Date du paiement <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="montant">
              Montant <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="montant"
                name="montant"
                value={formData.montant}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">€</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="methode">
              Méthode de paiement <span className="text-red-500">*</span>
            </label>
            <select
              id="methode"
              name="methode"
              value={formData.methode}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {methodesPaiement.map((methode) => (
                <option key={methode} value={methode}>
                  {methode}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="reference">
              Référence
            </label>
            <input
              type="text"
              id="reference"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              placeholder="Numéro de chèque, référence de virement..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
          >
            {isLoading ? <FaSpinner className="mr-2 animate-spin" /> : <FaSave className="mr-2" />}
            Enregistrer le paiement
          </button>
        </div>
      </form>
    </MainLayout>
  );
} 